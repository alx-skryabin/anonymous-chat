const youKick = (d, l) => {
  return `
    <div class="you-kick">
      <h3>You were kicked out by voting</h3>
      <div class="you-kick-result">
        <span><i class="fas fa-heart-broken"></i> ${d}</span>
        <span><i class="fas fa-heart"></i> ${l}</span>
      </div>
    </div>
  `
}

const resultVoting = data => {
  const {avatar, result} = data
  const {d, l} = result
  return `
    <div class="${d >= l ? 'dislike' : ''}">
      <i class="fas fa-heart-broken"></i>
      <span>${d}</span>
    </div>
    <img src="${avatar}" alt="user">
    <div class="${l >= d ? 'like' : ''}">
      <i class="fas fa-heart"></i>
      <span>${l}</span>
    </div>
  `
}

export {youKick, resultVoting}
