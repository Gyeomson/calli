
<!--     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.-->
<!--    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'-->
<!--    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, -->
<!--    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.-->
<!--     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'-->
<!--    ----------------------------------------------------------------- -->


<!--Welcome to your Node.js project on Cloud9 IDE!-->

<!--This chat example showcases how to use `socket.io` with a static `express` server.-->

<!--## Running the server-->

<!--1) Open `server.js` and start the app by clicking on the "Run" button in the top menu.-->

<!--2) Alternatively you can launch the app from the Terminal:-->

<!--    $ node server.js-->

<!--Once the server is running, open the project in the shape of 'https://projectname-username.c9users.io/'. As you enter your name, watch the Users list (on the left) update. Once you press Enter or Send, the message is shared with all connected clients.-->

# 캘리오는 밤 관리자

    $ mysql-ctl cli
    mysql> use calli
    mysql> quit
    $ node server.js

## VIEW
### 로그인화면
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
### 베너
    캘리오는밤 로그아웃 
    이미지 등록 | 푸시관리
### 이미지 목록 화면
    검색 
        오늘 | 1주일 | 1개월 | 3개월 | 6개월 | 12개월 | 날짜 선택 | 검색버튼
    이미지 총 ㅁ건 등록
    표
        No | 등록일 | 리스트 이미지 | 조회수 | 다운수 | 수정 | 삭제
    등록버튼
### 배너 등록
    등록 및 예약일 
        투데이 날짜 및 현재 시간 기본으로 표시
    이미지
        첨부파일 720*1280(기본 사이즈)
    저장 | 목록
### 자동 푸시
    자동 푸시 총 00건
    표
        구분 | 내용 | 상태
        매일 유저가 설정된 시간(일1회 | 오늘의 캘리가 배달되었습니다:) | 수정버튼
        
## Database
    <calli>
    #image
         id        |     name      |   click   |    down     | created_at
          int      |   varchar(30) |    int    |    int      |  datetime
    AUTO_INCREMENT |    NOT NULL   | default 0 |  default 0  |
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
    ======
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
    /imgAt 
      :starydate와 enddate 사이에 있는 이미지 리스트를 전송(POST 방식)
      return format json
      "result" : "[success|fail]"
      "count" : [이미지 리스트 갯수] - result가 success인 경우
      "imglist" : [이미지 리스트] - result가 success인 경우
        "id" "name" "click" "down" "created_at"
      "err" : [에러메세지 전송] - result가 fail 
    