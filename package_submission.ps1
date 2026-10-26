$ErrorActionPreference = "Stop"
$zipName = "Harish_prajeeth.A.S_921023104012_Task1.zip"
$tempDir = Join-Path $env:TEMP "submission_staging"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Copy-Item "candidate_details.txt" -Destination $tempDir
Copy-Item "Harish_prajeeth.A.S_Resume.pdf" -Destination $tempDir
Copy-Item "README.md" -Destination $tempDir

$destProject = Join-Path $tempDir "mathquest-ai"
robocopy "mathquest-ai" $destProject /E /XD "node_modules" ".git" ".taste-skill"

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipName -Force
Remove-Item -Recurse -Force $tempDir

Get-Item $zipName | Select-Object Name, Length, LastWriteTime
