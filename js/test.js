var out = '<section class="questions-container" style="display: none" data-qid="';
var arr1 = it;
if (arr1) {
  var question, index = -1, l1 = arr1.length - 1;
  while (index < l1) {
    question = arr1[index += 1];
    out += (question.id) + ',';
  }
}
out += '"> ';
var arr2 = it;
if (arr2) {
  var question, index = -1, l2 = arr2.length - 1;
  while (index < l2) {
    question = arr2[index += 1];
    out += ' <div class="question-container" data-name="question-' + (index + 1) + '" data-answer="' + (question.correct) + '"  data-question-id="' + (question.id) + '"> <dl> <dt>' + (index + 1) + '. ' + (question.title) + '<span style="color:red">（';
    if (question.type == "0") {
      out += '单选题';
      if (question.type == "0") {
        out += '多选题';
      }
      out += '）</span></dt> ';
      for (var i in question.contents) {
        out += ' ';
        if (question.type == "0") {
          out += ' <dd><input type="radio" name="question-' + (index + 1) + '" value="' + (i) + '"/><span>' + (i + ".") + ' ' + (question.contents[i]) + '</span></dd> ';
          if (question.type == "0") {
            out += ' <dd><input type="checkbox" name="question-' + (index + 1) + '" value="' + (i) + '"/><span>' + (i + ".") + ' ' + (question.contents[i]) + '</span></dd> ';
          }
          out += ' ';
        }
        out += ' </dl> </div> ';
      }
    }
    out += ' <div class="submit_btn"> <a class="btn btn-primary btn-large answers_submit" id="answers_submit">提交答案</a> </div></section>';
    return out;