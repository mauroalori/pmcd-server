# Setting up an Access Point on Raspberry Pi OS Bookworm

**Note:** This documentation is intended for **Raspberry Pi OS Bookworm**.  
Make sure you are using this version, as the process may differ in other releases.

## 1. Set the WLAN Country

Before starting, you must set your country for the wireless interface if it's not already configured.  
This is important to ensure legal wireless channels are used.

1. Open the configuration tool with:
   ```bash
   sudo raspi-config
   ```
2. Go to `Localisation Options` > `WLAN Country`.
3. Select your country from the list.
4. Confirm and exit.

<!-- Optionally, add an image here if available -->

---

## 2. Create the Access Point with Network Manager

Raspberry Pi OS Bookworm uses **Network Manager** by default, so you no longer need `dnsmasq`, `hostapd`, or similar services.

### Steps:

1. **Enable the Wi-Fi interface and create the access point:**
   ```bash
   sudo nmcli con add con-name hotspot ifname wlan0 type wifi ssid "PMCD"
   ```
   - Replace `"PMCD"` with your desired Wi-Fi name (SSID).
   - You can also change `hotspot` to any configuration name you prefer, but remember to use the same name in the following commands.

2. **Set the access point security and password:**
   ```bash
   sudo nmcli con modify hotspot wifi-sec.key-mgmt wpa-psk
   sudo nmcli con modify hotspot wifi-sec.psk "pmcd2025"
   ```
   - Replace `"pmcd2025"` with a strong password of your choice.

3. **Configure Network Manager to run in access point mode with shared IP addresses:**
   ```bash
   sudo nmcli con modify hotspot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
   ```

4. **Configure una IP estática para evitar conflictos con k3s:**
   ```bash
   sudo nmcli connection modify hotspot ipv4.addresses 10.10.10.1/24
   sudo nmcli connection modify hotspot ipv4.method shared
   ```

If everything is correct, your access point should be up and visible within a few seconds.  
You can now connect to it from another device (computer, phone, etc.).

---

## 3. Manage Network Settings with nmtui (Optional)

You can use the graphical tool `nmtui` to edit your network settings, such as upgrading security or changing the SSID:

```bash
sudo nmtui
```

This tool provides an easy-to-use interface for managing your network configurations.

---

## 4. Troubleshooting

If you experience any issues, check the logs with:

```bash
journalctl
```

You can filter the output for relevant information:

```bash
journalctl | grep hotspot
journalctl | grep wifi
```

---

**That's it!**  
Your Raspberry Pi should now be running as a Wi-Fi access point using Network Manager on Raspberry Pi OS Bookworm.
