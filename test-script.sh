read -p $'\nLog in'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "user"
}'

read -p $'\nGet all ingredients'
curl "http://localhost:3000/ingredients"

read -p $'\nSearch recipes by ingredients'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "ingredients": [1, 2]
}'