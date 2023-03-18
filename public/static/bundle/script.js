(()=>{"use strict";const t={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let e;const o=new Uint8Array(16);function d(){if(!e&&(e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!e))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(o)}const n=[];for(let t=0;t<256;++t)n.push((t+256).toString(16).slice(1));const s=function(e,o,s){if(t.randomUUID&&!o&&!e)return t.randomUUID();const r=(e=e||{}).random||(e.rng||d)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,o){s=s||0;for(let t=0;t<16;++t)o[s+t]=r[t];return o}return function(t,e=0){return(n[t[e+0]]+n[t[e+1]]+n[t[e+2]]+n[t[e+3]]+"-"+n[t[e+4]]+n[t[e+5]]+"-"+n[t[e+6]]+n[t[e+7]]+"-"+n[t[e+8]]+n[t[e+9]]+"-"+n[t[e+10]]+n[t[e+11]]+n[t[e+12]]+n[t[e+13]]+n[t[e+14]]+n[t[e+15]]).toLowerCase()}(r)},r=document.querySelector("[data-todo-form]"),c=document.querySelector("[data-todo-input]"),a=document.querySelector("[data-total-todos]"),l=document.querySelector("[data-completed-todos]"),i=document.querySelector(".not-found"),u=document.querySelector(".todo-container"),p=new class{constructor(){const t=localStorage.getItem("typed-todos");null===t?this.todos=[]:(this.todos=JSON.parse(t),this.updateTodoHeader(),this.renderAllTodos())}addNewTodo(t){const e={id:s(),title:t,completed:!1};console.log("New Todo",e),this.todos.push(e),c.value="",this.renderTodo(e),this.updateTodoHeader(),localStorage.setItem("typed-todos",JSON.stringify(this.todos))}createTodoElement(t){const e=document.createElement("div");e.classList.add("todo");const o=document.createElement("p");o.innerText=t.title;const d=document.createElement("div");d.classList.add("todo-btn-container");const n=document.createElement("button");n.innerText="✅";const s=document.createElement("button");s.innerText="✏️";const r=document.createElement("button");return r.innerText="🗑️",d.appendChild(n),d.appendChild(s),d.appendChild(r),n.addEventListener("click",(()=>this.handleCompleted(t,e))),e.appendChild(o),e.appendChild(d),e}renderTodo(t){1===this.todos.length&&(null==i||i.classList.remove("active"));const e=this.createTodoElement(t);u.appendChild(e)}renderAllTodos(){null==i||i.classList.remove("active"),this.todos.forEach((t=>{const e=this.createTodoElement(t);t.completed&&e.classList.add("completed"),u.appendChild(e)}))}updateTodoHeader(){a.innerText=this.todos.length.toString();let t=0;this.todos.forEach((e=>{e.completed&&t++})),l.innerText=t.toString()}handleCompleted(t,e){this.todos=this.todos.map((o=>o.id===t.id?(o.completed?e.classList.remove("completed"):e.classList.add("completed"),Object.assign(Object.assign({},o),{completed:!o.completed})):o)),localStorage.setItem("typed-todos",JSON.stringify(this.todos)),this.updateTodoHeader()}};null==r||r.addEventListener("submit",(t=>{t.preventDefault();const e=c.value;""!==e.trim()&&p.addNewTodo(e)}))})();