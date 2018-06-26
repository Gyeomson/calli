# 캘리오는 밤 관리자

    $ mysql-ctl cli
    mysql> use calli
    mysql> quit
    $ node server.js

## VIEW
#### 로그인화면
    아이디와 비밀버호를 입력해 주세요
    아이디
    비밀번호
    확인
    1)관리자 제작 시 임의로 관리자 생성
    클릭 시
    >정상 입력 시 - 로그인 됨
    >비정상 로그인 시 - alert창 띄움
    비정상 아이디 : "입력하신 아이디와 비밀번호가 일치하지 않습니다. 다시 시도해 주세요"
    비정상 비밀번호 : "입력하신 비밀번호가 맞지 않습니다. 다시 시도해 주세요"
#### 메인 
    전체 회원수 00명 | 총 다운 수 00건 | 총 AD뷰
    날짜 | 방문자수 | 신규회원 | 총 다운수 | 총 AD뷰
    2018.01.31 | 1,000 | 100 | 100 | 100
    
    마우스 오버시 아래 구분으로 상세 정보 노출
    남 00  00 IOS 00 And 00
    
    한 페이지에 50개씩 보여줌
#### 회원관리 - user
    성별(여성,남성) 계정(네이버,카카오) 기기(Android,ios) 정보(이메일,나이) 인풋 검색
    AD뷰 Best | 다운수 Best
    총 00명 (남자 00명/ 여자 00명 | Android 00명 / ios 00명)
    No | 가입일 | 최근 로그인 | 기기 | 계정 | 이메일 | 성별 | 나이 | 푸시시간 | 방문수 | 다운수 | 별 | AD뷰
    엑셀파일로 저장
    
    기본은 가입순대로 정렬된
#### 콘텐츠 관리(이미지 목록 화면) -image
    검색 
        오늘 | 1주일 | 1개월 | 3개월 | 6개월 | 12개월 | 날짜 선택 | 검색버튼
    오늘Best | 주간BEst | 월간Best
    이미지 총 ㅁ건 등록
    표
        No | 등록일 | 리스트 이미지(3개) | 조회수 | 다운수 | 출처 | 수정 | 삭제
    등록버튼
#### 콘텐츠 등록 (배너 등록)
    출처
    이미지
        프사
        배경(기존 이미지)
        글씨 원본
    저장 | 목록
#### 배경 관리
    검색 
        오늘 | 1주일 | 1개월 | 3개월 | 6개월 | 12개월 | 날짜 선택 | 검색버튼
    
    이미지 총 ㅁ건 등록
    표
        No | 등록일 | 리스트 이미지 | 수정 | 삭제
    등록버튼
#### 배경 등록
    이미지
        
    저장 | 목록
#### 베너
    검색 
        오늘 | 1주일 | 1개월 | 3개월 | 6개월 | 12개월 | 날짜 선택 | 검색버튼
    
    이미지 총 ㅁ건 등록
    표
        No | 등록일 | 리스트 이미지 | 조회수 | 링크 | 수정 | 삭제
    등록버튼
#### 배너 등록
    기간
        시작일 ~ 종료일
    URL
        
    이미지
    
    저장 | 목록
#### 푸시 관리 (자동 푸시)
    자동 푸시 총 00건
    표
        구분 | 내용 | 상태
        매일 유저가 설정된 시간(일1회 | 오늘의 캘리가 배달되었습니다:) | 수정버튼
        
## Database
    <calli>
    #user
    id | created_at | logined_at | device | 계정 | email | gender | age | push_time | visit | down | star | ADview
    - PRIMARY KEY(id)
    
    #image
         id        |   profile   |     name     |    write    |   resource   |   click   |    down     | created_at
          int      | varchar(30) |  varchar(30) | varchar(30) |  varchar(30) |    int    |    int      |  datetime
    AUTO_INCREMENT |    NOT NULL |   NOT NULL   |   NOT NULL  |   NOT NULL   | default 0 |  default 0  |
    - PRIMARY KEY(id)
    - profile:프사 name:모바일배경 글씨:write
    
    #bgimage
           id        |    content    | created_at
           int       |  varchar(30)  |  datetime
      AUTO_INCREMENT |    NOT NULL   |
    - PRIMARY KEY(id)
    
    #banner
           id        |    content    |   click   |      link      | created_at
           int       |  varchar(30)  |    int    |  varchar(2000) |  datetime
      AUTO_INCREMENT |    NOT NULL   | default 0 |                |
    - PRIMARY KEY(id)
    
    #push
           id        |    content    | created_at
           int       |  varchar(100) |  datetime
      AUTO_INCREMENT |    NOT NULL   |
    - PRIMARY KEY(id)
    
## API
    /clickup/[이미지 번호]
      : 이미지 번호에 해당하는 조회수를 1 증가
      return format json
      "result" : "[success|fail]"
      "click" : [수정된 조회수] - result가 success인 경우
      "err" : [에러메세지 전송] - result가 fail
    /downup/[이미지 번호]
      : 이미지 번호에 해당하는 다운수를 1 증가
      return format json
      "result" : "[success|fail]"
      "down" : [수정된 ekdnstn] - result가 success인 경우
      "err" : [에러메세지 전송] - result가 fail
    /imglist
      :전체 이미지 리스트를 전송
      return format json
      "result" : "[success|fail]"
      "count" : [전체 이미지 리스트 갯수] - result가 success인 경우
      "imglist" : [전체 이미지 리스트] - result가 success인 경우
        "id" "name" "click" "down" "created_at"
      "err" : [에러메세지 전송] - result가 fail
    =====================================
    /img/:id
      :id보다 큰 id를 가진 이미지 리스트를 전송
      return format json
      "result" : "[success|fail]"
      "count" : [이미지 리스트 갯수] - result가 success인 경우
      "imglist" : [이미지 리스트] - result가 success인 경우
        "id" "name" "click" "down" "created_at"
      "err" : [에러메세지 전송] - result가 fail
    /imgAt/:date
      :date보다 나중에 등록된 이미지 리스트를 전송(date 포함)
      return format json
      "result" : "[success|fail]"
      "count" : [이미지 리스트 갯수] - result가 success인 경우
      "imglist" : [이미지 리스트] - result가 success인 경우
        "id" "name" "click" "down" "created_at"
      "err" : [에러메세지 전송] - result가 fail  
    /imgPeriod (POST)
      :starydate와 enddate 사이에 있는 이미지 리스트를 전송
      return format json
      "result" : "[success|fail]"
      "count" : [이미지 리스트 갯수] - result가 success인 경우
      "imglist" : [이미지 리스트] - result가 success인 경우
        "id" "name" "click" "down" "created_at"
      "err" : [에러메세지 전송] - result가 fail 
     /pushlist
      :전체 푸시 리스트를 전송
      return format json
      "result" : "[success|fail]"
      "count" : [푸시 리스트 갯수] - result가 success인 경우
      "pushlist" : [푸시 리스트] - result가 success인 경우
        "id" "content" "created_at"
      "err" : [에러메세지 전송] - result가 fail 
    