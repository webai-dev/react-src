// https://blog.jenyay.com/building-javascript-widget/
import { widgetAppId, widgetModalId, WIDGET_VARS, BaseApiHost } from '../constants';

export const floatCode = `<script>
    (function (w,d,s,di,af,o,v,f,c,js,fjs,d1,d2,fb) {
        w['MyVars']=v;w[v]=w[v]||c;
        w['MyWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
        sh=d.createElement('link');sh.type="text/css";sh.rel="stylesheet";
        sh.href=f+'.css'; d.getElementsByTagName("head")[0].appendChild(sh);
        d1=d.createElement(di);d1.id='${widgetAppId}';d2=d.createElement(di);d2.id='${widgetModalId}';
        fb=d.getElementsByTagName('body')[0];fb.insertAdjacentElement(af,d1);fb.insertAdjacentElement(af,d2);
        js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
        js.id=o;js.src=f+'.js';js.async=1;fjs.parentNode.insertBefore(js,fjs);
    }(window,document,'script','div','afterbegin','sourcrW','sourcrC','${BaseApiHost}/build/app/widget',${WIDGET_VARS}));
    sourcrW();
</script>`;

export const carouselCode = `<div>
    <script>
        (function (w,d,s,o,v,f,c,js,fjs,d1,d2,fb) {
            w['MyVars']=v;w[v]=w[v]||c;
            w['MyWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
            sh=d.createElement('link');sh.type="text/css";sh.rel="stylesheet";
            sh.href=f+'.css'; d.getElementsByTagName("head")[0].appendChild(sh);
            js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
            js.id=o;js.src=f+'.js';js.async=1;fjs.parentNode.insertBefore(js,fjs);
        }(window,document,'script','sourcrW','sourcrC','${BaseApiHost}/build/app/widget',${WIDGET_VARS}));
        sourcrW();
    </script>
    <div id="${widgetAppId}"></div>
</div>`;
