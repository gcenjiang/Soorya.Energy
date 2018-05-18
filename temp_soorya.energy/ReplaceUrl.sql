UPDATE MsMenu SET URL = REPLACE(Url, '10.7.5.176', 'localhost') WHERE Url LIKE '%10.7.5.176%'
UPDATE MsMenu SET URL = REPLACE(Url, 'localhost', '10.7.5.176') WHERE Url LIKE '%localhost%'