<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.sparrowzoo.com/ui" prefix="j" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="A layout example with a side menu that hides on mobile, just like the Pure website.">
    <title>JSONP &ndash; Sparrow JS Framework</title>
    <jsp:include page="${root_path}/examples/head.jsp"/>
    <script type="text/javascript">
        require(['sparrow','domReady!'], function ($,dom) {
            $("jsonp","jsonp.html", "jsonp_id");
        });
        function callback(args) {
            document.getElementById("jsonp").innerHTML=args;
            alert(args);
            console.info(args);

        }
    </script>
</head>
<body>
<div id="layout">
    <jsp:include page="${root_path}/examples/menu.jsp"/>
    <div id="main">
        <div class="header">
            <h1>JSONP</h1>
            <h2>jsonp demo</h2>
        </div>
        <div id="jsonp" class="content">

        </div>
    </div>
</div>
</body>
</html>