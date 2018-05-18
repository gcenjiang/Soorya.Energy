DECLARE @Tab TABLE(I INT)
DECLARE @PageNumber AS INT, @RowspPage AS INT
SET @PageNumber = 1
SET @RowspPage = 5

DECLARE @COunter int = 1
WHILE @counter <= 30
begin
	insert into @tab values(@counter)
	set @counter = @counter + 1
end

SELECT i FROM (
             SELECT ROW_NUMBER() OVER(ORDER BY i) AS NUMBER, i
                    FROM @Tab
               ) AS TBL
WHERE NUMBER BETWEEN ((@PageNumber - 1) * @RowspPage + 1) AND (@PageNumber * @RowspPage)
ORDER BY i

SELECT i
FROM @Tab
ORDER BY i
OFFSET ((@PageNumber - 1) * @RowspPage) ROWS
FETCH NEXT @RowspPage ROWS ONLY
GO