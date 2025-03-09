<p align="center">
    <img src="assets/room-cards.png" align="center" width="50%">
</p>
<p align="center"><h1 align="center">Room Summary Card</h1></p>
<p align="center">
	<em>Room Data at Your Fingertips</em>
</p>

![Home Assistant](https://img.shields.io/badge/home%20assistant-%2341BDF5.svg?style=for-the-badge&logo=home-assistant&logoColor=white)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

![GitHub Release](https://img.shields.io/github/v/release/homeassistant-extras/petkit-device-cards?style=for-the-badge&logo=github)
![GitHub Pre-Release](https://img.shields.io/github/v/release/homeassistant-extras/petkit-device-cards?include_prereleases&style=for-the-badge&logo=github&label=PRERELEASE)
![GitHub Tag](https://img.shields.io/github/v/tag/homeassistant-extras/petkit-device-cards?style=for-the-badge&color=yellow)
![GitHub branch status](https://img.shields.io/github/checks-status/homeassistant-extras/petkit-device-cards/main?style=for-the-badge)

![stars](https://img.shields.io/github/stars/homeassistant-extras/petkit-device-cards.svg?style=for-the-badge)
![home](https://img.shields.io/github/last-commit/homeassistant-extras/petkit-device-cards.svg?style=for-the-badge)
![commits](https://img.shields.io/github/commit-activity/y/homeassistant-extras/petkit-device-cards?style=for-the-badge)
![license](https://img.shields.io/github/license/homeassistant-extras/petkit-device-cards?style=for-the-badge&logo=opensourceinitiative&logoColor=white&color=0080ff)

<p align="center">Built with the tools and technologies:</p>
<p align="center">
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=for-the-badge&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/Lit-324FFF.svg?style=for-the-badge&logo=Lit&logoColor=white" alt="Lit">
</p>
<br>

## Overview

A custom card for Home Assistant that provides a comprehensive room overview, including climate information, device states, and problem indicators. The card displays room temperature, humidity, connected devices, and entity states in an organized grid layout.

## Features

## Installation

### HACS (Recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=petkit-device-cards&category=dashboard)

1. Open HACS in your Home Assistant instance
2. Click the menu icon in the top right and select "Custom repositories"
3. Add this repository URL and select "Dashboard" as the category
   - `https://github.com/homeassistant-extras/petkit-device-cards`
4. Click "Install"

### Manual Installation

1. Download the `petkit-device-cards.js` file from the latest release in the Releases tab.
2. Copy it to your `www/community/petkit-device-cards/` folder
3. Add the following to your `configuration.yaml` (or add as a resource in dashboards menu)

```yaml
lovelace:
  resources:
    - url: /local/community/petkit-device-cards/petkit-device-cards.js
      type: module
```

## Usage

![WIP](https://img.shields.io/badge/Work%20In%20Progress-gold?style=for-the-badge&logo=internetcomputer)

Add the card to your dashboard using the UI editor or YAML:

### Card Editor

Slowly I'm enabling all the features in the card editor. Note that as things get converted to there some yaml settings may move / rename.

![editor](assets/editor.png)

### YAML

This is the most minimal configuarion needed to get started. See below for advanced usage.

```yaml
type: custom:petkit-device-cards
area: living_room
```

The card will automatically:

## Example Configurations

### Basic Configuration

```yaml
type: custom:petkit-device-cards
area: living_room
```

### Full Configuration

```yaml
type: custom:petkit-device-cards
area: living_room
```

For examples, see my HA configuration for my dashboard home page: [01-home.yaml](https://github.com/warmfire540/home-assistant-config-public/blob/home/ui_lovelace_minimalist/dashboard/views/01-home.yaml)

## Project Roadmap

- [x] **`Initial design`**: create initial card design

## Contributing

- **💬 [Join the Discussions](https://github.com/homeassistant-extras/petkit-device-cards/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/homeassistant-extras/petkit-device-cards/issues)**: Submit bugs found or log feature requests for the `petkit-device-cards` project.
- **💡 [Submit Pull Requests](https://github.com/homeassistant-extras/petkit-device-cards/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **📣 [Check out discord](https://discord.gg/F28wupKC)**: Need further help, have ideas, want to chat?

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/homeassistant-extras/petkit-device-cards
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

## License

This project is protected under the MIT License. For more details, refer to the [LICENSE](LICENSE) file.

## Acknowledgments

- Built using [LitElement](https://lit.dev/)
- Inspired by Home Assistant's chip design
- Button-Card was a huge inspo
- Thanks to all contributors!

[![contributors](https://contrib.rocks/image?repo=homeassistant-extras/petkit-device-cards)](https://github.com{/homeassistant-extras/petkit-device-cards/}graphs/contributors)

[![ko-fi](https://img.shields.io/badge/buy%20me%20a%20coffee-72A5F2?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/N4N71AQZQG)

## Code Quality

Forgive me and my badges..

Stats

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=bugs)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=coverage)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)

Ratings

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=homeassistant-extras_petkit-device-cards&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=homeassistant-extras_petkit-device-cards)

## Build Status

### Main

[![Bump & Tag](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/push.yml/badge.svg?branch=main)](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/push.yml)
[![Fast Forward Check](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/pull_request.yaml/badge.svg?branch=main)](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/pull_request.yaml)

### Release

[![Bump & Tag](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/push.yml/badge.svg?branch=release)](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/push.yml)
[![Merge](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/merge.yaml/badge.svg)](https://github.com/homeassistant-extras/petkit-device-cards/actions/workflows/merge.yaml)
