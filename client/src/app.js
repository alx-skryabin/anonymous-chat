import {initEventSocket} from './js/socket'
import {template} from './js/base'
import './styles/index.css'

document.querySelector('.app')
  .innerHTML = template()


// init socket
initEventSocket()
