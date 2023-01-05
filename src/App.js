import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function Header(props) {
  console.log("props", props, props.title);
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault(); // reload 방지
            props.onChangeMode(); // 아래 함수 호출
          }}>
          {props.title}
        </a>
      </h1>
    </header>
  );
}
function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={"/read/" + t.id} onClick={(event) => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); // 문자열이니까 숫자로 컨버팅해주는 Number 사용
        // event 함수 안에서 a 태그가 가진 id 값 얻어내기
        // target은 event를 유발시킨 태그 => a
      }}>
      {t.title}
      </a>
    </li>
    );
    // 자동으로 생성한 태그의 경우 리액트가 이 태그들을 추적해야하는데 추적할 때 근거가 있어야함
    // 그 근거로 key라고 하는 약속된 prop을 부여하면서 리액트가 성능을 높이고 정확하게 동작하는 걸 도와줌
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}
function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}
function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value; //form 태그
      const body = event.target.body.value;
      props.onCreate(title, body);  // props를 통해서 onCreate 함수 호출
    }}>
      <p><input type="text" name="title" placeholder="title" /></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}
function Update(props) {
  // 기존의 값이 value로 주입됐을 때 prop에서 state로 갈아탄다
  // 값이 바뀔때마다 바뀐 값을 state로 받아서 다시 피드백받아야 한다
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value; //form 태그
      const body = event.target.body.value;
      props.onUpdate(title, body);  // props를 통해서 onCreate 함수 호출
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={(event) => {
        // console.log(event.target.value);
        setTitle(event.target.value);
      }} /></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={(event) => {
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  // const _mode = userState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ]); // const로 선언 -> topics 값을 뒤에서 못바꿈
  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++){
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>  
      <li><a href={'/update/' + id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = []
        for (let i = 0; i < topics.length; i++){
          if (topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}/></li>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => { // 이 이벤트로 사용자가 입력한 title, body값을 create 컴포넌트 사용자에게 공급가능
      const newTopic = { id: nextId, title: _title, body: _body }
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++){
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      console.log(title, body);
      const newTopics = [...topics]
      const updateTopic = { id: id, title: title, body: body }
      for (let i = 0; i < newTopics.length; i++){
        if (newTopics[i].id === id) {
          newTopics[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header
        title="WEB"
        onChangeMode={() => {
          // alert('Header');
          setMode('WELCOME');
        }}></Header>
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          // alert(id);
          setMode('READ');
          setId(_id);
        }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
