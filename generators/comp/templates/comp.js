/**
 * @description  <%=compDesc%>
 */

<% if (isNeedStyle) { %>
require('./<%=compName%>.css');
<% } %>
<% if (isNeedTpl) { %>

function render(data) {
  return require('./<%=compName%>.tpl')(data);
}

exports.render = render;
<% } else { %>
<% } %>