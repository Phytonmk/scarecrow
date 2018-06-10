module.exports = (controllers) => {
  const c = controllers;
  return {
    0: {
      text: {
        'hi|hello': c.hi,
        'ping': c.ping,
        'test': c.test,
      },
      image: c.imageFrowarder,
      states: {
        feedback: c.feedback,
        userpic: c.setuserpic,
        // voteStep1: c.vote.init,
        // voteStep2: c.vote.rateBot,
        // voteStep3: c.vote.leaveComment
      }
    },
    10: {
      text: {
        'secret': c.secretAnswer,
        '/users': c.usersList
      }
    }
  }
}