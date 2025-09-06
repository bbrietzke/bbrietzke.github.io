



```
cpu, memory, logical_disk, physical_disk, net, service, system

```


```
$server_name = "DEV001"
$src = "https://github.com/prometheus-community/windows_exporter/releases/download/v0.31.2/windows_exporter-0.31.2-amd64.exe"
Enter-PSSession -ComputerName $server_name -Credential Administrator

New-Item -Path "C:\Program Files" -Name "windows_exporter" -Item "Directory"
New-Item -Path "C:\Program Files\windows_exporter" -Name "textfile_inputs" -Item "Directory"
New-Item -Path "C:\Program Files\windows_exporter" -Name "config.yaml" -Item "File"

Start-bitstransfer -source $src -destination "C:\Program Files\windows_exporter\windows_exporter.exe"

Set-Content -Path "C:\Program Files\windows_exporter\textfile_inputs\role.prom" -Value "role{role=`"application_server`"} 1"

Set-Content -Path "C:\Program Files\windows_exporter\config.yaml" -Value "collectors:"
Add-Content -Path "C:\Program Files\windows_exporter\config.yaml" -Value "  enabled: cpu,memory,logical_disk,physical_disk,net,service,system,iis"

New-Service -Name "windows_exporter" -BinaryPathName '"C:\Program Files\windows_exporter\windows_exporter.exe" --config.file="C:\Program Files\windows_exporter\config.yaml" --web.listen-address=:9182 --collector.textfile.directories="C:\Program Files\windows_exporter\textfile_inputs"'

Start-Service "windows_exporter"
Get-Service "windows_exporter"

New-NetFirewallRule -DisplayName "inbound windows_exporter" -Direction Inbound -Program "C:\Program Files\windows_exporter\windows_exporter.exe" -RemoteAddress LocalSubnet -Action Allow

Exit-PSSession
```


```
netsh advfirewall set domainprofile state on
```