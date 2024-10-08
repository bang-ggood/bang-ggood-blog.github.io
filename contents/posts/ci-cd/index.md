---
title: "CI/CD 파이프라인 구축기"
description:
date: 2024-09-09
update: 2024-09-09
tags:
  - backend
  - ci/cd
series: "방끗 백엔드의 기록"
---

> 이번 글에서는 저희 팀이 처음으로 겪었던 CI/CD 과정에서의 트러블슈팅 경험을 소개하고자 합니다!

## 😀 CI/CD 도구 선택 과정

CI/CD 도구를 선택할 때 우선적으로 고려한 기준은 두 가지입니다.

첫째, 오버엔지니어링을 피하는 것입니다.
기술의 장점이 무조건 좋다고 선택하는 것이 아니라, 그 장점이 현재 우리의 상황에 적합한지가 중요하다고 생각했습니다.

둘째, 러닝 커브가 높지 않은 기술인가입니다.
스프린트의 마감 기한이 길지 않기 때문에 당장 도입하기 쉬운 기술을 선택하고 추후 리팩토링하는 방향을 선택했습니다.
<Br>

여러가지 CI/CD 도구들을 간단히 비교하면서 가장 적합한 도구가 무엇인지 생각해 보았습니다!

### Github Action

- 장점
  - 별도 설치가 필요 없다
  - 비교적 간단하게 워크플로우를 설치 가능하다.
- 단점
  - Jenkins에 비해 일부 고급 기능, 플러그인이 부족할 수 있다.

### Jenkins

- 장점
  - 설정을 통해 세밀한 파이프라인 구축이 가능하다.
  - 참고할 수 있는 다양한 문서와 자료가 제공된다.
- 단점
  - 별도의 서버에 직접 구축을 해야한다.
  - Github action에 비해 러닝커브가 높다.

### CodeDeploy

- 장점
  - 여러 EC2에 배포를 간단하게 할 수 있다.
  - 무중단 배포 기능이 내장되어 있어 쉽게 가능하다.
- 단점
  - CodeDeploy를 사용함에 따라 인프라 구조가 복잡해진다.

결론부터 말씀드리자면, 저희 팀은 백엔드 CI/CD 파이프라인 구성을 위해 GitHub Actions를 사용하기로 결정했습니다. 😀

GitHub Actions는 CI/CD에 익숙하지 않은 팀원들도 비교적 빠르게 이해할 수 있을 것으로 판단했습니다. 또한, 프로젝트 규모를 고려했을 때, 사용할 EC2 인스턴스는 운영용과 개발용 각각 2대가 될 것으로 예상하여, 복잡한 인프라 구조는 필요하지 않다고 보았습니다.

따라서, GitHub Actions를 통해 간단하고 신속하게 인프라를 구축하기로 결정했습니다. 😉

## 😂 쉽지 않았던 파이프라인 구축기

우테코에서 CI/CD를 구축하는 환경은 일반적인 프로젝트를 진행할 때와는 다르게 제약사항이 있었습니다.

바로 ec2 보안 그룹 설정에서 80, 443 포트를 제외한 외부 접근을 막고 있다는 것입니다. 이런 제약사항으로 인해 CD를 구축할 때 시도한 여러 방법들이 실패하게 되었는데 하나하나 살펴보겠습니다!

### 1. ec2 ssh 접근

가장 먼저 시도해본 방식은 ec2에 `scp-action`을 통해 build된 jar 파일을 전송하고, `ssh-action`을 사용해 ec2에 접속하여 리눅스 명령어로 jar 파일을 실행시키는 방식입니다.

이 방식을 사용했을 때 다음과 같은 에러 메세지를 받았습니다.

<img src="https://velog.velcdn.com/images/banggood/post/7eb49fd5-6190-48fd-8543-7e310deca296/image.png"/>

기본적으로 `scp-action`, 'ssh-action`은 22번 포트로 요청을 보내기 때문에 ec2의 보안 규칙에 막혀 timeout 에러를 발생시킨 것이죠!

cf) 글을 작성하면서 든 생각인데, 기본 포트가 22번이라면 80, 443으로 설정했을 때 작동하는지 추후 테스트가 필요할 것 같네요!

### 2. s3에 jar 파일 저장

S3에 JAR 파일을 저장하는 방식도 시도해보았습니다.

그러나 AWS IAM의 Access Key가 필요한데, 보안상의 이유로 우테코에서는 Access Key를 제공하지 않아서 해당 방식을 빠르게 포기했습니다.

### 3. 도커 허브 사용

도커 허브에 jar 파일을 업로드하고, ec2에 다운받아 배포하는 방식도 고려해보았습니다!

하지만 도커 허브에 올라간 jar 파일이 public으로 열려있기 때문에 다른 사용자들이 열람할 수 있다는 점에서 보안상의 이슈가 있을 수 있다고 생각했습니다.
또한 현재 서비스의 규모 상 도커 기술을 사용하는 것에 대한 필요성을 느끼지 못하였기 때문에 도커는 사용하지 않기로 결정했습니다😀

### 4. 깃허브 self-hosted runner

결론적으로 CD 워크플로를 구성할 때 깃허브의 Runner를 사용하기로 결정했습니다😁

러너는 GitHub Actions 워크플로를 실행하는 서버 역할을 합니다.
기본적으로 러너의 종류는 크게 Github-hosted runner와 Self-hosted runner 두 가지로 구분할 수 있습니다.

그 중 저희가 사용한 러너는 Self-hosted runner 입니다!

러너를 직접 ec2 내부에 설치함으로써 깃허브 저장소와의 연결이 가능하게 만들었습니다.

간단하게 CD를 위해 러너가 사용된 방식을 설명드리면,

1. 깃허브 artifact 저장소에 build된 jar 파일 업로드
2. ec2 내부의 러너가 artifact 저장소에 있는 jar 파일 다운로드
3. jar 파일 실행

이런 과정을 통해 CD가 정상적으로 수행되었지만, 궁금한 점이 남아있었습니다.

**어떻게 러너는 ec2 내부에서 깃허브 저장소와 소통을 하는 거지?**

이에 대한 해답은 공식문서를 통해 찾아낼 수 있었습니다!

<img src="https://velog.velcdn.com/images/banggood/post/a55508a0-e884-42bf-b01a-8e35f1596cd2/image.png"/>

Self-hosted runner의 동작 방식을 살펴보면 50초 동안 long poll 방식으로 깃허브의 응답을 기다립니다.
만약 Github action에서 작업이 실행되어 러너에게 요청을 보내면 이 요청은 443 포트로 넘어오게 되고, 이는 현재 ec2에 열려 있는 443포트를 통해 러너로 들어올 수 있게 됩니다.

## 결론

지금까지 어떤 과정을 통해 CICD 파이프라인을 구축했는지 살펴봤습니다!
여러 제약사항이 있는 상황 속에서 방법을 찾아내는 것이 쉽지만은 않았지만 꼭 필요한 과정이었던 것 같습니다.
현재 상황에서는 이 방식이 최선이라 생각하지만, 서버가 늘어나고 여러 환경 요인이 변화하면 파이프라인도 수정이 필요할 것 같습니다!
파이프라인 구축기는 그 때 다시 돌아오겠습니다😀
