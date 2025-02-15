import{B as k}from"./index-DVzcH--h.js";import{a as A}from"./entry/index-BcidWyMC.js";import{E as O,aa as h,a8 as C,aV as m,ao as W,ab as B}from"./antd-BFwNME3X.js";import{d as D,f as T,a7 as F,Z as n,a8 as I,a9 as r,k as o,u as a,$ as t,_ as i,aa as f,a0 as l,F as c,G as S,ac as E}from"./vue-DhXvXWyK.js";const N=t("h1",null,"Đề bài",-1),R={class:"shadow-lg rounded-md p-4 mb-4"},U=t("h1",null,"Bài làm của học sinh",-1),j={class:"text-primary mb-0"},L={class:"mb-0"},M={class:"mb-0"},V={key:0,class:"text-green-500"},G={key:1,class:"text-red-500"},H={key:2,class:"text-danger"},z=t("h3",null,"Chấm điểm và nhận xét",-1),P={class:"flex justify-end"},$=`
    <h2>Welcome to Our Platform</h2>
    <p>
      Thank you for visiting our website! We are dedicated to providing you with the best experience possible. 
      Whether you are here to explore new opportunities, learn something new, or simply browse, we have something for everyone.
    </p>
    
    <h3>Our Features</h3>
    <p>
      Our platform is designed with user-friendliness in mind. Here are some of the key features you can enjoy:
    </p>
    <ul>
      <li><strong>Fast and Secure:</strong> We prioritize security while ensuring smooth and fast performance.</li>
      <li><strong>Responsive Design:</strong> Enjoy a seamless experience on any device, whether mobile, tablet, or desktop.</li>
      <li><strong>24/7 Customer Support:</strong> Our support team is always ready to assist you.</li>
      <li><strong>Regular Updates:</strong> We continuously improve our platform based on user feedback.</li>
    </ul>

    <h3>Why Choose Us?</h3>
    <p>
      There are many platforms available, but here’s why our service stands out:
    </p>
    <ol>
      <li><strong>Reliability:</strong> We have built a strong reputation for delivering quality service.</li>
      <li><strong>Innovation:</strong> We stay ahead by implementing the latest technologies.</li>
      <li><strong>Community:</strong> Join thousands of satisfied users who trust our platform.</li>
    </ol>

    <h3>Get Started Today</h3>
    <p>
      Signing up is quick and easy. Click <a href="#" style="color: blue; text-decoration: underline;">here</a> to create an account and start exploring the amazing features we offer. 
      If you have any questions, feel free to <a href="#" style="color: blue; text-decoration: underline;">contact us</a>.
    </p>

    <p>We look forward to serving you!</p>
    <h2>Welcome to Our Website</h2>
    <p>
      We are thrilled to have you here! Our platform offers a variety of features 
      to enhance your experience. Explore our latest updates and discover new possibilities.
    </p>
    <ul>
      <li>✔ Fast and secure services</li>
      <li>✔ User-friendly interface</li>
      <li>✔ 24/7 customer support</li>
    </ul>
    <p>
      Stay connected and enjoy seamless browsing. If you have any questions, feel free 
      to <a href='#' style='color: blue; text-decoration: underline;'>contact us</a>.
    </p>
  `,J="We are thrilled to have you here! Our platform offers a variety of features to enhance your experience. Explore our latest updates and discover new possibilities.",Y=D({__name:"DetailModal",props:{skillType:{type:String,default:""}},setup(y){const g=O.TextArea,p=y,{t:b}=A(),u=T({score:0,feedback:""}),v=[{no:1,content:"What is the capital of France?",options:[{id:"A",text:"Option A"},{id:"B",text:"Option B"},{id:"C",text:"Option C"},{id:"D",text:"Option D"}],actualAnswer:"A",studentAnswer:"A"},{no:2,content:"What is the capital of Germany?",options:[{id:"A",text:"Option A"},{id:"B",text:"Option B"},{id:"C",text:"Option C"},{id:"D",text:"Option D"}],actualAnswer:"B",studentAnswer:"B"},{no:3,content:"What is the capital of Italy?",options:[{id:"A",text:"Option A"},{id:"B",text:"Option B"},{id:"C",text:"Option C"},{id:"D",text:"Option D"}],actualAnswer:"C",studentAnswer:"D"}];function x(){}return(w,d)=>{const _=F("a-button");return n(),I(a(k),E(w.$attrs,{"default-fullscreen":"","show-cancel-btn":!1,"show-ok-btn":!1,"can-fullscreen":!1}),{default:r(()=>[o(a(B),{gutter:[16,16]},{default:r(()=>[o(a(h),{span:12},{default:r(()=>[t("div",{class:"shadow-lg rounded-md p-4 mb-4"},[N,t("div",{innerHTML:$})])]),_:1}),o(a(h),{span:12},{default:r(()=>[t("div",R,[U,p.skillType==="Reading"||p.skillType==="Listening"?(n(),i(c,{key:0},f(v,e=>t("div",{key:e.no,class:"mb-4"},[t("h2",j,"Question "+l(e.no),1),t("h3",L,l(e.no)+". "+l(e.content),1),t("ul",M,[(n(!0),i(c,null,f(e.options,s=>(n(),i("li",{key:s.id},[s.id===e.actualAnswer&&e.actualAnswer===e.studentAnswer?(n(),i("span",V,l(s.id+". "+s.text),1)):s.id===e.actualAnswer&&e.actualAnswer!==e.studentAnswer?(n(),i("span",G,l(s.id+". "+s.text),1)):(n(),i("span",H,l(s.id+". "+s.text),1))]))),128))]),t("h4",null,"Đáp án đúng: "+l(e.actualAnswer),1)])),64)):(n(),i(c,{key:1},[t("div",{innerHTML:J,class:"mb-4"}),z,o(a(C),{model:u.value},{default:r(()=>[o(a(m),{label:"Điểm",name:"score","label-col":{span:3},"label-align":"left"},{default:r(()=>[o(a(W),{value:u.value.score,"onUpdate:value":d[0]||(d[0]=e=>u.value.score=e),min:0,max:10,required:""},null,8,["value"])]),_:1}),o(a(m),{label:"Nhận xét",name:"feedback","label-col":{span:3},"label-align":"left"},{default:r(()=>[o(a(g),{value:u.value.feedback,"onUpdate:value":d[1]||(d[1]=e=>u.value.feedback=e)},null,8,["value"])]),_:1}),t("div",P,[o(_,{type:"primary",onClick:x},{default:r(()=>[S(l(a(b)("common.confirm")),1)]),_:1})])]),_:1},8,["model"])],64))])]),_:1})]),_:1})]),_:1},16)}}});export{Y as _};
