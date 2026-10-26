# 🚀 Dev-Connect: Real-time Digital Co-working Space

> **"개발자들을 위한 가장 힙한 공유 오피스"** > Dev-Connect는 1인 개발자가 구축한 실시간 협업 및 소통 플랫폼입니다. 뽀모도로 타이머, 실시간 채팅, 코드 스니펫 공유 등 개발자에게 꼭 필요한 기능들을 네온 감성의 UI에 담았습니다.


![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)


## 🔗 Service Link
🚀 **Live Demo**: [https://dev-connect-gules.vercel.app/](https://dev-connect-gules.vercel.app/)

---

## ✨ Key Features (주요 기능)

### 👤 Anonymous Fun & Identity
* **Random Nickname System**: 접속 시마다 부여되는 **랜덤 닉네임**으로 익명성을 보장하며, 매번 새로운 페르소나로 대화에 참여하는 재미를 더했습니다.
* **Real-time User Sync**: 현재 접속 중인 유저 목록과 그들의 실시간 상태(공부 중, 휴식 중 등)를 한눈에 파악할 수 있습니다.

### 💬 Real-time Communication
* **Next-level Chat**: 마크다운 백틱을 이용한 코드 강조 및 Gist 카드 임베딩 기능을 지원합니다.
* **Live Reactions**: 메시지 하단에 실시간으로 이모티콘 리액션을 달 수 있으며, 낙관적 업데이트(Optimistic Update)로 즉각적인 반응을 제공합니다.
* **Gist & Code Snippet**: 깃허브 Gist 카드 생성 및 백틱(`)을 이용한 고성능 코드 하이라이팅을 지원합니다.

### 🛠 Developer Tools
* **GitHub Integration**: GitHub OAuth를 통한 간편 로그인 및 유저 프로필 연동을 지원합니다.
* **Pomodoro & Status**: 실시간으로 연동되는 뽀모도로 타이머를 통해 현재 집중 중인 유저들을 확인하고 자극을 받습니다.
* **Focus TodoList**: 업무 효율을 높여주는 **TodoList 기능**을 내장하여, 협업과 개인 업무 관리를 동시에 해결합니다.

### 🖼 Content Sharing
* **Drag & Drop Upload**: 이미지 파일을 채팅창에 끌어다 놓으면 Supabase Storage를 통해 즉시 업로드 및 공유됩니다.
* **Smart URL Preview**: 이미지 URL을 붙여넣으면 자동으로 미리보기를 생성합니다.

### 🤖 Self-Managing Infrastructure (지능형 자동화)
* **Automated Storage Purge**: 시스템이 스스로 최적화하는 자율 주행 인프라를 지향합니다.
  * **Weekly Auto-Cleanup**: 매주 일요일 오후 1시(KST), `pg_cron`과 `Edge Functions`가 협업하여 일주일 이상 된 임시 데이터들을 자동 삭제합니다.
  * **Cost & Security Optimization**: 불필요한 스토리지 비용을 절감하고, 불필요한 데이터 보유를 최소화하여 보안 무결성을 유지합니다.

---


## 🛠 Tech Stack (기술 스택)

| Category | Tech |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS |
| **Animation** | Framer Motion |
| **Backend** | Supabase (Serverless) |
| **Database** | PostgreSQL (Supabase) |
| **Realtime** | Supabase Realtime (Postgres Changes) |
| **Hosting** | Vercel |

---
## 📸 Preview (미리보기)

> 네온 감성의 UI와 실시간 기능이 집약된 **Dev-Connect**의 주요 구동 화면입니다.

### 🖥️ Main Dashboard
가로 폭을 꽉 채워 시원하게 보여주는 메인 대시보드 뷰입니다.

<img src="https://github.com/user-attachments/assets/ca3657a2-0c80-4703-b3f5-16e571ffa4d7" width="70%" alt="메인 화면" />
<img src="https://github.com/user-attachments/assets/e7919162-5a04-4b3b-bd58-8e125e390b37" width="70%" alt="채팅 화면" />

---


| 💻 Github 연동 | 😊 실시간 이모지 리액션 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/d8bf13b3-0ea6-4b02-bdf8-20c1681ce3eb" height="320px" /> | <img src="https://github.com/user-attachments/assets/797f5b65-7a2b-44ed-be9b-ce7526dd6d7a" height="180px" /> |


| 📝 Todo Drag&Drop | 📝 Focus Todo List| 📋 File Upload | ⌨️ Code Block |
| :---: | :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/ea4e88da-6da0-4240-b8fb-a416847bd9ce" height="320px" /> | <img src="https://github.com/user-attachments/assets/27ef3175-aa01-4018-aa6f-5c69988db3f3" height="320px" /> | <img src="https://github.com/user-attachments/assets/c734c142-1557-4512-bc1c-e72ff351b004" height="320px" /> | <img src="https://github.com/user-attachments/assets/a827ffe0-0274-4c83-b49e-dfcfc1389b88" height="320px" /> |

---
## 🚀 Getting Started

### Prerequisites
* Node.js 24.x (LTS)
* Supabase Project & Table Setup

### Installation
```bash
# 레포지토리 클론
git clone https://github.com/yunsuper/Dev-Connect.git

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📜 License
This project is licensed under the MIT License.