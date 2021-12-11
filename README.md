# JavaScript メモアプリ
メモの一覧・参照・追加・編集・削除ができるコマンドラインメモアプリです。
## このアプリでできること
### メモの追加
標準入力に入ってきたテキストを新しいメモとして追加する。

`echo "メモ内容" | node memo.js`

[![Image from Gyazo](https://i.gyazo.com/798362999fa1ba446f0a92fc7d7455f6.gif)](https://gyazo.com/798362999fa1ba446f0a92fc7d7455f6)

### メモの一覧表示
それぞれのメモの最初の行のみを表示する。

`node memo.js -l`

[![Image from Gyazo](https://i.gyazo.com/b9029aac901da6cdb915bf51d6b5857c.gif)](https://gyazo.com/b9029aac901da6cdb915bf51d6b5857c)

### メモの参照
選んだメモの全文が表示される。

`node memo.js -r`

[![Image from Gyazo](https://i.gyazo.com/d4c249ba4c308b1c90c28b724e91224f.gif)](https://gyazo.com/d4c249ba4c308b1c90c28b724e91224f)

### メモの削除

選んだメモが削除される。

`node memo.js -d`

[![Image from Gyazo](https://i.gyazo.com/a73cd1094f7c6be99a4c742b544554f9.gif)](https://gyazo.com/a73cd1094f7c6be99a4c742b544554f9)
