---
title: "방끗 프론트 CI 구축기"
description:
date: 2024-07-23
update: 2024-07-23
tags:
  - frontend
  - infra
series: "방끗 프론트의 기록"
---

## CI 란? 

CI(Continuous Integration)는 팀이 일관된 코딩 스타일과 품질을 유지할 수 있도록 돕는 중요한 도구입니다.  저희 방끗도 일관적인 코드 스타일을 위해 eslint, prettier, stylelint 등을 활용하여 CI 환경을 구축했습니다. 오늘 저희 팀이 어떤 설정을을 어떻게 구축했는지 소개하겠습니다.  

![alt text](image.png)

<br>

## 1. 방끗이 사용한 CI 소개

### 1.1 ESLint

ESLint는 JavaScript 코드의 품질을 유지하기 위해 사용하는 정적 분석 도구입니다. 
저희는 `no-unused-vars`, `no-console`, `no-var` 등의 규칙을 적용해 코드 품질을 강화하고 있습니다. 특히, `eslint-plugin-unused-imports` 플러그인을 통해 사용하지 않는 import 문을 자동으로 삭제하는 기능도 도입했습니다.

### 1.2 Prettier

Prettier는 코드 포맷팅을 자동화하여 일관된 스타일을 유지하게 해줍니다. 특히 그중에서 저희는 `singleQuote`, `semi`, `trailingComma` 등의 옵션을 사용해 코드 스타일을 통일했습니다.

### 1.3 Stylelint

Stylelint는 CSS, SCSS, 그리고 css-in-js를 대상으로 하는 린팅 도구입니다. 특히 css-in-js를 사용할 때 자동완성 기능을 제대로 동작하게 하기 위한 설정을 추가했습니다.

### 1.4 Import 순서 정렬

import 순서를 정리하기 위해 `simple-import-sort` 플러그인을 사용하고 있습니다. 이 과정에서 import alias(`@`)를 사용할 때 발생했던 문제를 해결한 방법도 소개합니다.

---  

<br>

## 2. ESLint 적용

ESLint 설정에서 중요한 부분은 불필요한 변수를 제거하고, console 관련 메시지를 제한하는 것이었습니다. 
예를 들어, 다음과 같이 설정을 통해 사용하지 않는 import 문은 자동으로 삭제되며, `console`은 `warn`, `error`, `info`만 허용하도록 제어하고 있습니다.

```json
{
  "no-unused-vars": "warn",
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": ["warn"],
  "no-console": ["error", { "allow": ["warn", "error", "info"] }],
  "ignorePatterns": ["dist", "webpack.config.js", "tsconfig.json", "public"]
}

```

구축 진행 중 설정한 옵션들이 잘 적용이 안되는 문제가 발생했습니다. 

원인을 찾아보니 기존에 2개의 다른 종류의 eslint 파일을 사용하고 있어서 문제 발생하는 것 같다고 판단하였습니다. 자세히 설명하면 기존에 `eslintrc.json` 과 `eslint.config.json` 을 동시에 사용하고 있었다보니, 이 사이에서 속성 충돌이 발생하여 에러가 난 것으로 추정되어  `eslintrc.json` 하나의 파일만 남기도록 수정하였습니다. 

---

<br>

## 3. Prettier 적용

Prettier 설정에서는 팀 내에서 일관된 코드 스타일을 유지하기 위해 다음과 같은 옵션을 사용했습니다:

```json
{
  "singleQuote": true,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "bracketSpacing": true
}

```

이러한 설정을 통해 코드의 코드 가독성을 높이고, 코드 리뷰 과정에서 스타일에 대한 논의 시간을 절약할 수 있었습니다.

---

<br>

## 4. Stylelint 적용

stylelint 를 적용하기 위해 처음에는 stylelint VSCode extension 를 활용했습니다. 

그런데 css-in-js를 사용할 때, stylelint의 자동완성 기능이 작동하지 않는 문제를 겪었습니다. 이를 해결하기 위해서는 설치 이후 아래와 같은 설정을 추가해야 가능했습니다. 

```json
{
  "stylelint.validate": ["css", "typescriptreact"],
  "stylelint.packageManager": "yarn"
}

```

위 설정을 통해 CSS와 함께 TypeScript 파일 내에서도 stylelint가 적용되도록 구성했습니다. 하지만 SCSS 관련 설정을 추가할 때는 동적 스타일링을 할 때 오류가 발생하는 경우가 있어, SCSS 옵션은 제외했습니다.

이외에도 stylelint.json 을 작성하고 스크립트로 저장될 때마다 실행되는 방법도 있었지만 익스텐션이 가능한 상황에서 불필요하다고 판단하여 전자의 방법으로 선택했습니다. 

---

<br>

## 5. Import 순서 정렬 적용

VSCode에서 저장 시 import 순서가 자동으로 정렬되기를 바래서 eslint 설정에 추가해주었습니다. 

그러나 import 순서가 자동으로 정렬되지 않는 문제가 발생했습니다. 
특히, 절대 경로(`@`)로 import할 때 `react`보다 위로 올라가는 현상이 있었습니다. 이를 해결하기 위해 `simple-import-sort`와 `import` 플러그인을 설치하고, 다음과 같은 규칙을 추가했습니다:

```json
{
  "plugins": ["simple-import-sort", "import"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error"
  }
}

```

또한, VSCode에서 저장 시 자동으로 ESLint와 organize imports가 실행되도록 설정했습니다:

```json

{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}

```

이를 통해 저장할 때마다 import가 자동으로 정리되고, alias(`@`)를 사용하는 import도 적절한 순서에 배치되도록 설정했습니다.

---

이렇게 초반에 팀의 CI 환경을 구축하는 과정을 통해 lint 도구와 포맷팅 도구들을 결합하여 코드 품질을 유지하고, 일관성을 보장할 수 있게 되었습니다.