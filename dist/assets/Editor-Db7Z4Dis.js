import{_ as c}from"./BasicForm.vue_vue_type_script_setup_true_lang-DbX2m63q.js";import"./BasicForm.vue_vue_type_style_index_0_lang-BL3smh9L.js";import"./componentMap-BjYe58Mw.js";import{b5 as d,b as f}from"./entry/index-BcidWyMC.js";import{P as _}from"./index-DnpQZsBg.js";import{M as i,C as a}from"./index-C0Ld875h.js";import{d as b,Z as g,a8 as h,a9 as n,k as s,u as o,l as p}from"./vue-DhXvXWyK.js";import"./FormItem.vue_vue_type_script_lang-BQsfJt-d.js";import"./helper-JLwI6lBn.js";import"./antd-BFwNME3X.js";import"./index-DVzcH--h.js";import"./useWindowSizeFn-SAmktNkd.js";import"./useFormItem-oxzr_Srp.js";import"./RadioButtonGroup.vue_vue_type_script_setup_true_lang-DFfZeCIC.js";import"./index-BKjGR123.js";import"./uuid-D0SLUWHI.js";import"./useSortable-Chl02yjp.js";import"./download-C8Z1CAz1.js";import"./base64Conver-bBv-IO2K.js";import"./index-BQqLbfF_.js";import"./IconPicker.vue_vue_type_script_setup_true_lang-D_32YSSg.js";import"./copyTextToClipboard-DJj00FMq.js";import"./index-BH-x8rO3.js";import"./index-BO5ERYHo.js";import"./PageWrapper.vue_vue_type_style_index_0_lang-wgu38p8X.js";import"./useContentViewHeight-CCI8OV4I.js";import"./onMountedOrActivated-CvY6VkYA.js";const G=b({__name:"Editor",setup(C){const m=[{field:"title",component:"Input",label:"title",defaultValue:"标题",rules:[{required:!0}]},{field:"JSON",component:"Input",label:"JSON",defaultValue:`{
        "name":"BeJson",
        "url":"http://www.xxx.com",
        "page":88,
        "isNonProfit":true,"
        address:{ 
            "street":"科技园路.",
            "city":"江苏苏州",
            "country":"中国"
        },
}`,rules:[{required:!0,trigger:"blur"}],render:({model:e,field:t})=>p(a,{value:e[t],mode:i.JSON,onChange:r=>{e[t]=r},config:{tabSize:10}})},{field:"PYTHON",component:"Input",label:"PYTHON",defaultValue:`def functionname( parameters ):
   "函数_文档字符串"
   function_suite
   return [expression]`,rules:[{required:!0,trigger:"blur"}],render:({model:e,field:t})=>p(a,{value:e[t],mode:i.PYTHON,onChange:r=>{e[t]=r}})}],{createMessage:u}=f();function l(e){u.success("click search,values:"+JSON.stringify(e))}return(e,t)=>(g(),h(o(_),{title:"代码编辑器组件嵌入Form示例"},{default:n(()=>[s(o(d),{title:"代码编辑器组件"},{default:n(()=>[s(o(c),{labelWidth:100,schemas:m,actionColOptions:{span:24},baseColProps:{span:24},onSubmit:l})]),_:1})]),_:1}))}});export{G as default};
