$username = "1492493662@qq.com"
$password = "@hmc123456"
$url = "https://github.com/666hmc/snake-game-deploy.git"
$encodedCreds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$username`:$password"))
$headers = @{Authorization = "Basic $encodedCreds"}

git remote remove origin
git remote add origin $url
git config credential.helper store
git push -u origin master