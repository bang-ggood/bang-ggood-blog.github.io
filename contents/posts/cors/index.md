---
title: "CORS 설정"
description:
date: 2024-08-02
update: 2024-08-02
tags:
  - backend
  - infra
series: "방끗 백엔드의 기록"
---

웹 서비스를 개발하다보면 CORS 에러를 흔히 볼 수 있습니다. 설정을 제대로 해주지 않으면 프론트와 통신할 수 없기 때문에 CORS에 대해 제대로 이해하고 설정하는 것이 매우 중요합니다. 이번 포스팅에서는 방끗 팀이 겪었던 CORS 에러를 바탕으로 제대로된 CORS 설정에 대한 글을 작성하고자 합니다.

## CORS 에러 왜 발생해?

CORS는 Cross-Origin Resource Sharing의 약자로 **교차 출처 리소스 공유**라는 뜻입니다. 단어 그자체로 보면 말이 참 어렵죠 😨

CORS에서 가장 중요한 개념은 **출처(Origin)**입니다. Cross-Origin은 서로 출처가 다르다는 것을 의미합니다. 출처는 URL에서 **프로토콜과 도메인, 포트**까지 포함하는 개념입니다.

<img src="https://github.com/user-attachments/assets/5b031b03-24e6-4d74-a67e-4cd636dc41f1"/>

방끗 서비스에서는 프론트와 백엔드가 서로 다른 도메인을 사용하고 있습니다.

- 방끗 프론트 : [http://bang-ggood.com](http://bang-ggood.com/)
- 방끗 백엔드 : [https://api.bang-ggood.com](https://api.bang-ggood.com/)

CORS는 개념 그 자체로 보면 서로 다른 출처끼리 리소스를 공유할 수 있게 하기 때문에 긍정적인 개념이라고 할 수 있습니다. CORS 이전에 SOP라는 브라우저 정책이 있습니다. SOP는 **Same-Origin Policy**로 동일한 출처 사이에만 리소스를 공유할 수 있게 합니다. 이는 **CSRF**로부터 사용자를 보호하기 위해 등장한 중요한 보안 메커니즘이었습니다.

예전에는 프론트와 백엔드를 따로 구성하지 않아 모든 처리가 같은 도메인 안에서 이루어졌습니다. 하지만 시간이 지나 프론트에서 API를 요청하기 시작하면서 프론트와 백엔드가 서로 다른 도메인에 있는 경우가 많아졌습니다. 이를 해결하기 위해 등장한 정책이 CORS입니다.

CORS가 안전하게 동작하기 위해서는 서버에서 **허용 가능한 출처**에 대해 명시해주어야 합니다. 이를 제대로 설정해주지 않으면 클라이언트(Client)를 신뢰할 수 없어 브라우저단에서 에러를 내뿜습니다.

## CORS 접근 시나리오

그렇다면 CORS 에러를 막기 위해 무엇을 설정해야 할까요? [CORS가 발생할 수 있는 3가지 시나리오](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)를 살펴보며 필요한 설정 정보를 알아보겠습니다.

### 예비 요청 Preflight Request

브라우저는 요청을 한 번에 보내지 않고 예비 요청을 보낸 후 본 요청을 보냅니다. 예비 요청은 본 요청을 보내기 전 브라우저가 안전한지 먼저 점검합니다. 교차 출처 요청이 사용자 데이터에 잘못된 영향을 미치는 것을 방지하기 위해서입니다.

**OPTIONS 메서드**를 사용해 요청을 보내는 것이 특징입니다. OPTIONS는 서버로부터 추가 정보를 얻기 위해 사용되며 리소스를 변경할 수 없는 안전한 메서드입니다.

OPTIONS 요청과 함께 두 개의 다른 요청 헤더가 전송됩니다.

🔑 Client → 🔒 Server

```java
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type,x-pingother
```

🔒 Server → 🔑 Client

```java
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

### 단순 요청 Simple Request

일부 요청은 예비 요청을 보내지 않습니다. 심플한 만큼 다음의 특정 조건을 만족할 때만 예비 요청을 생략할 수 있습니다.

- 요청 메서드가 GET, HEAD, POST 중 하나여야 합니다.
- Accept , Accept-Language, Content-Language, Content-Type , Range 헤더만 설정할 수 있습니다.
- application/x-www-form-urlencoded , multipart/form-data , text/plain 의 미디어 타입만 가능합니다.

대부분의 API 요청은 application/json으로 통신하기 때문에 Content-Type에 위반되어 단순 요청 조건에 해당하지 않습니다.

### 인증된 요청 **Credentialed Request**

클라이언트에서 서버로 자격 증명을 요청할 때 사용되는 요청입니다. 자격 증명을 포함하기 위해서는 credentials 옵션을 "include" 로 설정해야 합니다.

서버에서는 인증된 요청에 대한 헤더를 다음과 같이 설정해야 합니다. 응답 헤더 값을 “\*” 와일드카드로 지정해서는 안 됩니다.

```java
Access-Control-Allow-Origin : https://foo.example
Access-Control-Allow-Headers : X-PINGOTHER, Content-Type
Access-Control-Allow-Methods : POST, GET
Access-Control-Expose-Headers : Content-Encoding, Kuma-Revision
Access-Control-Allow-Credentials: true
```

## HTTP 요청 헤더

서버가 접근 제어 요청을 위해 보낼 수 있는 HTTP 응답 헤더는 다음으로 정리할 수 있습니다.

- Access-Control-Allow-Origin
- Access-Control-Expose-Headers
- Access-Control-Max-Age
- Access-Control-Allow-Credentials
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers

## Spring으로 CORS 설정하기

Spring에서 CORS 설정할 수 있는 방법은 [다음 블로그](https://www.baeldung.com/spring-cors)를 참고합니다.

### 1. WebMvcConfigurer 사용

스프링 MVC 구성에 CORS 관련 설정을 추가할 수 있습니다. 체이닝 방식을 통해 CorsRegistry을 구성할 수 있습니다.

```java
@Configuration
public class CorsConfigWithMVC implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://bang-ggood.com")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}

```

### 2. CorsFilter 사용

Spring Security와 함께 정교하게 CORS를 설정할 수 있는 방법입니다. Spring Security를 사용하지 않을 때도 WebMvcConfigurer의 설정을 대체할 수 있습니다.

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins("https://bang-ggood.com");
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return new CorsFilter(source);
    }
}
```

### DEV, PROD 에서의 CORS 설정

dev와 prod 환경에서 출처를 다르게 설정할 수 있습니다. dev 환경에서는 localhost의 요청을 허용하지만, 실서비스가 운영되는 prod 환경에서는 이를 허용하면 안 되기 때문입니다. 이를 위해 application-prod.yml과 application-dev.yml 파일에 각각 허용 가능한 출처를 지정하고, 해당 값을 주입해 사용하는 방식으로 구현했습니다.

```java
@Configuration
@ConfigurationProperties(prefix = "cors")
public class CorsConfig {

    private List<String> allowOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return new CorsFilter(source);
    }

    public List<String> getAllowOrigins() {
        return allowOrigins;
    }

    public void setAllowOrigins(List<String> allowOrigins) {
        this.allowOrigins = allowOrigins;
    }
}

```
