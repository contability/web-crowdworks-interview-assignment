# DIRECTORY-STRUCTURE

---

# 디렉토리 구조

```
./
├── docs
├── public
├── src
│   ├── assets
│   │   └── data
│   ├── components
│   ├── hooks
│   ├── types
│   └── utils
├── node_modules
├── package.json
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

# 디렉토리 구조 설명

## 📁 **루트 디렉토리**

프로젝트의 설정 파일과 문서를 포함하는 루트 디렉토리.

### 📂 **docs**

프로젝트 문서와 가이드를 담은 디렉토리.

### 📂 **public**

정적 파일을 저장하는 디렉토리. 브라우저에서 직접 접근 가능한 파일들이 위치한다.

### 📂 **src**

프로젝트의 주요 소스 코드를 담은 디렉토리.

#### 📂 **assets**

이미지, 폰트, 데이터 파일 등의 정적 자산을 저장하는 디렉토리.  
&nbsp;&nbsp;&nbsp;&nbsp;📂 **data**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JSON 형식의 데이터 파일을 저장하는 디렉토리.

#### 📂 **components**

UI 컴포넌트를 담은 디렉토리.

#### 📂 **hooks**

커스텀 React 훅을 관리하는 디렉토리.

#### 📂 **types**

TypeScript 타입 정의 파일을 담은 디렉토리.

#### 📂 **utils**

프로젝트 전반에서 사용되는 유틸리티 함수를 담은 디렉토리.
