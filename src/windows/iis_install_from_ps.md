

```
Enter-PSSession -ComputerName DEV001 -Credential Administrator

Get-WindowsFeature -Name Web-*

Install-WindowsFeature -name Web-Server, Web-ASP, Web-Websockets, Web-Asp-Net45, Web-Ftp-Service, Web-Windows-Auth, Web-Basic-Auth, Web-Digest-Auth,  Web-Scripting-Tools, Web-Mgmt-Service

```


