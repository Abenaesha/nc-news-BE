\c nc_news_test;

-- SELECT * FROM topics;
-- SELECT * FROM users;
-- SELECT articles.article_id, articles.title, articles.topic, COUNT(comments.comment_id) AS comment_count
-- FROM articles 
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id;
SELECT * FROM articles;
SELECT * FROM comments;