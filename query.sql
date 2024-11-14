WITH authors as (
	SELECT a.entity_id, a.revision_id
		 , group_concat(b.name ORDER BY a.delta SEPARATOR ', ') AS authors
	FROM gfl.node__field_author_credit a

	LEFT JOIN gfl.users_field_data b
	on a.field_author_credit_target_id = b.uid

	GROUP BY a.entity_id, a.revision_id
)
/*
SELECT a.nid, a.vid
	 , b.type, b.title
	 , b.status
	 , c.field_page_description_value as description
	 , h.authors
	 , FROM_UNIXTIME(b.created) as created
	 , FROM_UNIXTIME(b.changed) as changed
	 , d.delta
	 , e.type
	 , i.field_secondary_title_value
	 , nvl(g.field_text_value, m.field_text_value) as text
	 , nvl(d.field_page_content_target_id, l.field_content_to_embed_target_id) as content_id
	 , nvl(d.field_page_content_target_revision_id, l.field_content_to_embed_target_revision_id) as content_revision_id
	 , f.field_topic_content_target_id 
	 , f.field_topic_content_target_revision_id
	 , j.fid, j.module, j.type, j.id
	 , k.filename, k.uri
*/
SELECT b.type, b.title, c.field_page_description_value as description, h.authors, i.field_secondary_title_value as sub_title, coalesce(g.field_text_value, m.field_text_value) as data, k.filename
FROM gfl.node a

LEFT JOIN gfl.node_field_data b
ON a.nid = b.nid
AND a.vid = b.vid

LEFT JOIN gfl.node__field_page_description c
ON a.nid = c.entity_id
AND a.vid = c.revision_id

LEFT JOIN gfl.node__field_page_content d
ON a.nid = d.entity_id
AND a.vid = d.revision_id

LEFT JOIN gfl.paragraphs_item_field_data e
ON d.field_page_content_target_id = e.id
AND d.field_page_content_target_revision_id = e.revision_id

LEFT JOIN gfl.paragraph_revision__field_topic_content f
ON d.field_page_content_target_id = f.entity_id
AND d.field_page_content_target_revision_id = f.revision_id

LEFT JOIN gfl.paragraph__field_text g
ON f.field_topic_content_target_id = g.entity_id
AND f.field_topic_content_target_revision_id = g.revision_id

LEFT JOIN authors h
ON a.nid = h.entity_id

LEFT JOIN gfl.paragraph__field_secondary_title i
ON d.field_page_content_target_id = i.entity_id
AND d.field_page_content_target_revision_id = i.revision_id

LEFT JOIN gfl.file_usage j
ON f.field_topic_content_target_id = j.id

LEFT JOIN gfl.file_managed k
ON j.fid = k.fid

LEFT JOIN gfl.node_revision__field_content_to_embed l
on a.nid = l.entity_id
and a.vid = l.revision_id

LEFT JOIN gfl.paragraph__field_text m
ON l.field_content_to_embed_target_id = m.entity_id
AND l.field_content_to_embed_target_revision_id = m.revision_id

WHERE b.type IN ('combat_mission', 'node_embed', 'page')
AND (i.field_secondary_title_value IS NOT NULL OR COALESCE(g.field_text_value, m.field_text_value) IS NOT NULL OR k.filename IS NOT NULL)

-- AND a.nid in (27016, 27031)
ORDER BY b.changed DESC, a.nid DESC, a.vid DESC, d.delta