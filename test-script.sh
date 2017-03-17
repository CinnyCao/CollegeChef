read -p $'\nLog in'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "user"
}'

printf '\n'

read -p $'\nLog in with missing inputs - will get 400'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user"
}'

printf '\n'

read -p $'\nLog in with wrong inputs - will get 403'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "userName": "user",
  "password": "password"
}'

printf '\n'

read -p $'\nGet all ingredients'
curl "http://localhost:3000/ingredients"

printf '\n'

read -p $'\nSearch recipes by ingredients case 1 (result might be empty since recipes are randomly created)'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "ingredients": [1, 2]
}'

printf '\n'

read -p $'\nSearch recipes by ingredients case 2 (result might be empty since recipes are randomly created)'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "ingredients": [0]
}'

printf '\n'

read -p $'\nSearch recipes by ingredients with no input- will get 400'
curl -X "POST" "http://localhost:3000/search" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{

}'

printf '\n'

read -p $'\nGet list (10) of hot (mostly commented) recipes'
curl "http://localhost:3000/recipes/hot"


read -p $'\nGet list (10) of remarkable (highestly rated) recipes'
curl "http://localhost:3000/recipes/remarkable"


read -p $'\nGet list (10) of new recipes'
curl "http://localhost:3000/recipes/new"

printf '\n'

read -p $'\nGet list of favorited recipes of user with id 0'
-H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIwIiwiZXhwIjoxNTUyODQ1Nzg5NjM0fQ.DjnMuU5no8k8YBRttxmYnOksHbGPRkiWMqSwV7FZDAs"\
curl "http://localhost:3000/recipes/favorite"

read -p $'\nGet list of favorited recipes of user with id 1'
-H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
curl "http://localhost:3000/recipes/favorite"

read -p $'\nGet list of favorited recipes without token - will get 401'
curl "http://localhost:3000/recipes/favorite"


read -p $'\nGet list of recipes uploaded by current user'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{

}'

printf '\n'

read -p $'\nGet list of recipes uploaded by user called user'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "userName": "user"
}'

printf '\n'

read -p $'\nGet list of recipes uploaded with no bearer - will get 401'
curl -X "POST" "http://localhost:3000/recipes/uploaded" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "userName": "user"
}'

printf '\n'

read -p $'\nGet notification settings of current user'
curl -X "GET" "http://localhost:3000/notification_settings" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8"

printf '\n'

read -p $'\nUpdate notification settings of current user'
curl -X "PUT" "http://localhost:3000/notification_settings" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "enableTypeNumbers": [1, 2]
}'

printf '\n'

read -p $'\nGet notification history of current user'
curl -X "GET" "http://localhost:3000/notification" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8"

printf '\n'

read -p $'\nGet all comments of a given recipe - recipe have mutiple comments'
curl "http://localhost:3000/recipe/1/comments" \

printf '\n'

read -p $'\nGet all comments of a given recipe - recipe have no comment'
curl "http://localhost:3000/recipe/0/comments" \

printf '\n'

read -p $'\nComment recipe'
curl -X "POST" "http://localhost:3000/recipe/0/comments" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "isImage": true,
   "message": "/img/recipes/steak.jpg"
}'

printf '\n'

read -p $'\nRate recipe -- first rate a recipe'
curl -X "POST" "http://localhost:3000/recipe/0/rate" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "scores": 3
}'

printf '\n'

read -p $'\nRate recipe -- update rate'
curl -X "POST" "http://localhost:3000/recipe/9/rate" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
   "scores": 3
}'

printf '\n'

read -p $'\nFavorite recipe'
curl -X "POST" "http://localhost:3000/recipe/1/favorite" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxIiwiZXhwIjoxNTUyODQwOTg0Nzk4fQ.oxRn-qB7itdDP-W8zDpwlzfmwHlC8esVqTC1Q5xZOGk"\
     -H "Content-Type: application/json; charset=utf-8" \

printf '\n'
