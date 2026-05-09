# Before I do anything on Proxmox, I do this first...

**Date:** 2026-04-30
**Channel:** Techno Tim (TechnoTimLive)
**URL:** https://youtu.be/GoZaMgEgrHw
**Duration:** 23:04
**Upload Date:** 2020-11-28

---

## Summary

- Techno Tim's personal checklist of every step he runs after a fresh Proxmox VE install, refined over 20+ installs across the past year
- Covers 11+ steps from enabling no-subscription updates through ZFS storage setup, PCIe passthrough (IOMMU), VLAN-aware networking, NIC teaming, backups, templates, and clustering
- Aimed at homelabbers who want a consistent, repeatable Proxmox baseline -- the kind of list you build up after repeatedly forgetting things

---

## Key Points

1. **Enable no-subscription updates** -- SSH in, edit `/etc/apt/sources.list` to add the no-subscription (pve-no-subscription) repo, comment out the enterprise repo in `/etc/apt/sources.list.d/pve-enterprise.list` (avoids errors if no paid subscription), then `apt-get update && apt dist-upgrade`. Tim says PVE6+ no-sub has been "surprisingly stable". Can also do this in the Proxmox web UI via the Updates panel.

2. **Storage setup (ZFS)** -- Before creating any ZFS pool, wipe each disk first with `fdisk` (delete all partitions, write). Tim demos wiping `/dev/sda` then creating a ZFS pool named `fast10` via the UI with 4x Samsung 860 EVO 1TB SSDs. Visuals show he selects all 4 drives (RAID10 config, ~1.81 TiB free). Sets `compression=on` and `ashift=12`.

3. **S.M.A.R.T. monitoring** -- After ZFS setup, verify all disks show "PASSED" in Proxmox Disks view. The Supermicro boot SSD (`/dev/sde`, 18GB) is visible as LVM, the 4 data SSDs are ZFS.

4. **IOMMU / PCIe Passthrough** -- Edit `/etc/default/grub`, change `GRUB_CMDLINE_LINUX_DEFAULT` from `"quiet"` to `"quiet intel_iommu=on"`. A commented-out advanced line with `pcie_acs_override=downstream,multifunction` is visible in the file. Then edit `/etc/modules` to add: `vfio`, `vfio_iommu_type1`, `vfio_pci`, `vfio_virqfd`. Run `update-grub`, reboot.

5. **VLAN-aware networking** -- Edit the Linux bridge `vmbr0` and check "VLAN aware" in the UI. Alternatively via `/etc/network/interfaces`: add `bridge-vlan-aware yes` and `bridge-vids 2-4094` (or specific VID range). Tim shows both UI and manual file methods.

6. **NFS storage share** -- Add an NFS share (ID: `backups`, server: `192.168.0.22`, export: `/mnt/storage/pve_proxmox`) to Datacenter > Storage. Enables Disk images, ISO images, and VZDump backup files. The NFS share also holds ISOs including `virtio-win-0.1.185.iso` for Windows VM drivers.

7. **Scheduled backups** -- Create a backup job under Datacenter > Backup. Storage: `backups` NFS, Mode: Snapshot, Compression: ZSTD, schedule multiple days per week, email notifications enabled. Can also trigger immediate manual backups per-VM.

8. **NIC Teaming (LACP)** -- For servers with multiple NICs, edit `/etc/network/interfaces` to create a `bond0` interface aggregating `eno1` + `eno2` with `bond-mode 802.3ad` and `bond-xmit-hash-policy layer2+3`. Update `vmbr0` to use `bridge-ports bond0` instead of `eno1`. Requires switch-side LACP config too (shown in UniFi with Port Profile: All, Operation: Aggregate).

9. **VM Templates** -- Convert an Ubuntu VM (ubuntu-20.04.1-legacy-server) to a template for fast cloning. Proxmox shows "Linked Clone" and "Full Clone" options.

10. **Clustering** -- Create a cluster under Datacenter > Cluster > Create Cluster. Name it (shown: `home-cluster`), choose the cluster network NIC. Copy Join Information, then go to the second Proxmox node and join. Result: both nodes (`hydra` at 192.168.0.13, `draso` at 192.168.0.11) visible under one datacenter view.

11. **HA caveat** -- Not running HA because it requires an odd number of nodes for quorum (even numbers can never reach majority vote). Mentions using a Raspberry Pi with Corosync to establish quorum as a workaround he's seen. Plans to build HA into Kubernetes services instead.

---

## Tools, People & Concepts Mentioned

- **Tools:** Proxmox VE 6.2, ZFS, fdisk, apt/apt-get, nano, GRUB, vfio, nmcli/network interfaces, NFS, UniFi Network, ZSTD compression
- **People:** Techno Tim (TechnoTimLive on Twitch/YouTube/Discord)
- **Concepts:** IOMMU, PCIe passthrough, VLAN-aware bridges, LACP/802.3ad NIC bonding, quorum, Corosync, live VM migration, Proxmox clustering, ZFS ashift

---

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Intro -- Tim explains his checklist motivation |
| 0:53 | Step 1: Enabling updates via terminal |
| 2:57 | Updates via UI option shown |
| ~4:00 | Step 2: Storage -- fdisk disk wipe, ZFS pool creation |
| ~6:00 | Step 3: S.M.A.R.T. monitoring verification |
| ~7:00 | Step 4: IOMMU -- GRUB + /etc/modules edits |
| ~12:00 | Step 5: VLAN-aware networking |
| ~14:00 | NIC Teaming (Step 10) -- /etc/network/interfaces bond config |
| ~16:00 | NFS storage + backups |
| ~19:00 | VM Templates |
| ~20:18 | Clustering -- create cluster, copy join info, join second node |
| ~21:07 | HA explanation -- quorum, odd-number-of-nodes rule |
| 21:49 | Wrap-up + shoutout to Discord community |

---

## Visual-Only Insights (not in transcript)

- **Actual hardware specs visible:** The Proxmox node summary reveals a **20-core Intel Xeon E5-2690 v4 @ 2.60GHz** (Broadwell, 1 socket), **125.77 GB RAM**, running **PVE 5.4.73-1-pve** kernel, 0% swap used. This is a Supermicro server (visible in UniFi as "SuperMicro - PVE-1").
- **ZFS pool name and disk serials:** Pool named `fast10`, using 4x Samsung 860 EVO 1TB SSDs (serials visible: S62JNE0N600091D, 6000957, 600094W, 600091P), resulting in 1.81 TiB free (RAID10 equivalent).
- **Two separate Proxmox nodes:** The video actually switches between two nodes -- `draco` (used for most demos) and `draso` (final clustering demo shows it with VMs `100 (win 10)` and `101 (win 10)` already running). The cluster `home-cluster` has nodes `hydra` (192.168.0.13) and `draso` (192.168.0.11).
- **GRUB file shows advanced commented passthrough line:** `/etc/default/grub` has a commented-out `pcie_acs_override=downstream,multifunction video$` line -- not mentioned verbally but useful for GPU passthrough edge cases.
- **NFS share contains existing backups:** The `backups` NFS store already contains VZDump files for VMs 100 and 101 (18GB each), disk images, and both `virtio-win-0.1.185.iso` (520MB) and `ubuntu-20.04.1-legacy-server-amd64.iso`.
- **UniFi switch config:** Port 21 on the UniFi 24-port switch is connected to the Supermicro at 1Gbps. For NIC teaming, the port is set to "Aggregate" mode in UniFi (not just Proxmox-side config).
- **Proxmox subscription nag visible:** Frame 11 shows the "No valid subscription" popup -- this is the expected behavior after disabling the enterprise repo without a paid subscription.
- **Twitch stream outro:** Final frames show Tim's live streaming setup with purple/blue LED lighting, a microphone, and Twitch overlay showing chat, followers, and social handles (@TechnoTimLive, Techno.Tim on Instagram).

---

## Saved To

- reports/2026-04-30-techno-tim-proxmox-first-things.md
- Open Brain
- Frames archived: store/watch-cache/GoZaMgEgrHw/ (80 frames + contact sheet)
