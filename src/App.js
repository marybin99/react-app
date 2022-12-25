import logo from "./logo.svg";
import "./App.css";
function Header(props) {
  console.log("props", props, props.title);
  return (
    <header>
      <h1>
        <a href="/" onClick={(event)=>{
          event.preventDefault(); // reload 방지
          props.onChangeMode(); // 아래 함수 호출
        }}>{props.title}</a>
      </h1>
    </header>
  );
}
function Nav(props) {
  const lis = []
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/' + t.id} onClick={(event) => { 
        event.preventDefault();
        props.onChangeMode(event.target.id);  
        // event 함수 안에서 a 태그가 가진 id 값 얻어내기
        // target은 event를 유발시킨 태그 => a 
      }}>{t.title}</a></li>);
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
function App() {
  const topics = [
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ]; // const로 선언 -> topics 값을 뒤에서 못바꿈
  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        alert('Header');
      }}></Header>
      <Nav topics={topics} onChangeMode={(id) => {
        alert(id);
      }}></Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
    </div>
  );
}

export default App;
