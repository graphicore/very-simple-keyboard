/* jshint browser: true, esversion: 8, laxcomma: true, laxbreak: true */
import DOMTool from './domTool.mjs';

function buildButton(domTool, cmdFn, label, value) {
    console.log('buildButton', domTool, cmdFn, label, value);
    const cssClass = `button-${value}`
      , btn = domTool.createElement('a', {'class': cssClass}, label)
      ;
    btn.addEventListener('click', (event)=>{
        event.preventDefault();
        btn.classList.add('clicked');
        setTimeout(()=>btn.classList.remove('clicked'));
        cmdFn(value);
    });
    return btn;
}

function buildKeyBoard(domTool, elem, cmdFn) {
    const keys = (`a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,st,`
                    + `ß,ä,ö,ü,wer,wie,was,warum,wo,space:,backspace:⌫,neu`
            )
            .split(',')
            .map(v=>v.indexOf(':') !== -1
                        ? v.split(':')
                        : [v, v]
            )
      , buttons = []
      ;
    for(const item of keys) {
        const [value, label] = Array.isArray(item)
             ? item
             : [item, item]
           , button = buildButton(domTool, cmdFn, label, value)
           ;
        buttons.push(button);
    }
    elem.append(...buttons);
}

function command(domTool, outElem, key) {
    switch(key) {
        case 'neu':
            domTool.clear(outElem);
            break;
        case 'backspace':
            if(outElem.lastChild)
                outElem.lastElementChild.remove();
            break;
        case 'space':
            {
                const elem = domTool.createElement('span', {}, ' ');
                outElem.append(elem);
            }
            break;
        default:
            {
                const elem = domTool.createElement('span', {}, key);
                outElem.append(elem);
            }
    }

}
// Should not require to wait until load (all resources, images etc are loaded),
// so this would make it much quicker at startup.
function main() {
    // This is the new world, after some bottom up rewriting/refactoring
    // this is the top down adoption.
    const domTool = new DOMTool(document)
      , outElem = domTool.document.querySelector('.out')
      , kbElem = domTool.document.querySelector('.kb')
      , cmd = command.bind(null, domTool, outElem)
      ;
    buildKeyBoard(domTool, kbElem, cmd);
}

if(document.readyState === 'loading')
    window.addEventListener('DOMContentLoaded', main);
else
    main();
