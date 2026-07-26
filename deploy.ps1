$gitPath = "C:\Program Files\Git\bin\git.exe"
$dir = "d:\自制游戏或网页"
$repo = "https://github.com/666hmc/snake-game-deploy.git"

Set-Location $dir

Write-Host "Initializing Git..."
& $gitPath init

Write-Host "Configuring user..."
& $gitPath config user.email "1492493662@qq.com"
& $gitPath config user.name "666hmc"

Write-Host "Adding files..."
& $gitPath add .

Write-Host "Committing..."
& $gitPath commit -m "Add snake game"

Write-Host ""
Write-Host "======================"
Write-Host "Enter GitHub Token:"
Write-Host "(Go to https://github.com/settings/tokens)"
Write-Host "======================"
$token = Read-Host

Write-Host "Adding remote..."
& $gitPath remote add origin "https://${token}@github.com/666hmc/snake-game-deploy.git"

Write-Host "Pushing..."
& $gitPath push -u origin master

Write-Host ""
Write-Host "Done! Press any key to exit..."
Read-Host