read -p $'\nLog in'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "user"
}'

read -p $'\nGet all ingredients'
curl "http://localhost:3000/ingredients"