$username = "1492493662@qq.com"
$password = "@hmc123456"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$username`:$password"))
$headers = @{
    Authorization = "Basic $base64Auth"
    "Content-Type" = "application/json"
}
$body = '{"name":"snake-game","description":"贪吃蛇游戏","private":false}'
Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Body $body -Headers $headers