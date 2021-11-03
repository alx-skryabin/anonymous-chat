import {Chat} from './js/socket'
import {template} from './js/template.chat'
import './styles/index.css'

document.querySelector('.app')
  .innerHTML = template()


// init chat
new Chat().initChat()
