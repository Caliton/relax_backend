(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"013f":function(e,t,o){"use strict";o.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-layout",[a("q-page-container",{staticStyle:{"background-color":"#FEFFF5"}},[a("q-page",{staticClass:"q-pa-lg gradient-background"},[a("div",{staticClass:"relax-menu row q-pa-md justify-between"},[a("span",{staticClass:"relax-logo"},[e._v("Relax")]),a("div",{staticClass:"relax-menu-itens"},[a("ul",[a("li",[a("q-btn",{staticClass:"text-cyan",attrs:{rounded:"",color:"grey-1","no-caps":"",label:"Acessar"}},[a("q-menu",{attrs:{offset:[8,8],"content-style":"border-radius: 16px;","transition-show":"scale","transition-hide":"scale"}},[a("div",{staticClass:"row no-wrap q-pa-lg"},[a("div",{staticClass:"column"},[a("q-form",{on:{submit:e.onLogin}},[a("q-input",{attrs:{"input-style":"color: #6F6F6F",color:"primary",borderless:"",dense:"",placeholder:"Login","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Qual é mesmo o teu login?"}]},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onSubmit(t)}},scopedSlots:e._u([{key:"prepend",fn:function(){return[a("q-icon",{attrs:{name:"person",color:"grey-5"}})]},proxy:!0}]),model:{value:e.user.login,callback:function(t){e.$set(e.user,"login",t)},expression:"user.login"}}),a("q-space",{staticStyle:{heigth:"40px"}}),a("q-input",{attrs:{icon:"eva-lock","input-style":"color: #6F6F6F",dense:"",borderless:"",type:e.isPwd?"password":"text",placeholder:"Password","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Precisamos verificar se é você mesmo"}]},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onSubmit(t)}},scopedSlots:e._u([{key:"prepend",fn:function(){return[a("q-icon",{attrs:{name:"eva-lock",color:"grey-5"}})]},proxy:!0},{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:e.isPwd?"visibility_off":"visibility",color:"grey-5"},on:{click:function(t){e.isPwd=!e.isPwd}}})]},proxy:!0}]),model:{value:e.user.password,callback:function(t){e.$set(e.user,"password",t)},expression:"user.password"}}),a("div",[a("q-btn",{staticClass:"action-button q-mr-sm full-width",attrs:{unelevated:"",rounded:"",loading:e.loading,label:"Entrar","no-caps":"",type:"submit",color:"light-blue"},scopedSlots:e._u([{key:"loading",fn:function(){return[a("q-spinner-bars")]},proxy:!0}])})],1)],1)],1)])])],1)],1)])])]),a("q-space",{staticClass:"q-pb-lg q-pt-lg"}),a("div",{staticClass:"relax-body "},[a("div",{staticClass:"relax-copywhite text-center text-white"},[e._v("\n          Sinta-se de férias\n          "),a("br"),e._v("\n          ao fazer gestão de férias de seus Colaboradores.\n        ")]),a("q-space",{staticClass:"q-pb-lg q-pt-lg"}),a("div",{staticClass:"flex flex-center"},[a("img",{directives:[{name:"tilt",rawName:"v-tilt",value:{scale:1.1},expression:"{ scale: 1.1 }"}],staticStyle:{margin:"0 auto"},attrs:{src:o("4022"),width:"500px"}})])],1)],1)],1)],1)},n=[],s=o("a34a"),r=o.n(s),i=(o("7f7f"),o("96cf"),o("c973")),l=o.n(i),c=o("1f7c"),u=o("b4fb"),d={name:"Login",data:function(){return{user:{login:"",password:""},newUser:{name:"",login:"",password:"",isGuest:!1,profileId:2,departamentId:2},isPwd:!0,loading:!1,tab:"btn1"}},beforeCreate:function(){var e=this;localStorage.getItem("token")&&this.$router.push({name:"colaborator"}),c["a"].$on("showNotify",(function(t){e.showNotify(t)}))},beforeDestroy:function(){c["a"].$off("showNotify")},methods:{onLogin:function(){var e=this;return l()(r.a.mark((function t(){var o,a,n,s;return r.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.loading=!0,t.next=4,e.$axios.post(u["a"].signin,e.user);case 4:o=t.sent,a=o.data,n=a.token,s=a.user,localStorage.setItem("token",n),localStorage.setItem("user_id",s.id),localStorage.setItem("user_collaborator_id",s.collaborator.id),localStorage.setItem("user_name",s.collaborator.name),localStorage.setItem("user_hiringdate",s.collaborator.hiringdate),localStorage.setItem("user_role",s.role),e.$router.push("/index"),e.$q.notify({color:"positive",type:"positive",message:"Seja Bem Vindo!"}),t.next=20;break;case 17:t.prev=17,t.t0=t["catch"](0),console.log(t.t0);case 20:return t.prev=20,e.loading=!1,t.finish(20);case 23:case"end":return t.stop()}}),t,null,[[0,17,20,23]])})))()},showNotify:function(e){this.$q.notify({color:e.color,textColor:"white",icon:e.icon,message:e.message})}}},p=d,f=(o("1139"),o("2877")),g=o("4d5a"),m=o("09e3"),y=o("9989"),b=o("9c40"),v=o("4e73"),w=o("0378"),h=o("27f9"),x=o("0016"),k=o("2c91"),q=o("a154"),C=o("f09f"),S=o("a370"),_=o("eebe"),Q=o.n(_),F=Object(f["a"])(p,a,n,!1,null,null,null);t["default"]=F.exports;Q()(F,"components",{QLayout:g["a"],QPageContainer:m["a"],QPage:y["a"],QBtn:b["a"],QMenu:v["a"],QForm:w["a"],QInput:h["a"],QIcon:x["a"],QSpace:k["a"],QSpinnerBars:q["a"],QCard:C["a"],QCardSection:S["a"]})},1139:function(e,t,o){"use strict";var a=o("82e1"),n=o.n(a);n.a},4022:function(e,t,o){e.exports=o.p+"img/vacation.2d195685.svg"},"82e1":function(e,t,o){}}]);