var keyWords = ["boolean", "byte", "char", "double", "false", "float", "int", "long",
                "new", "null", "short", "true", "void", "instanceof", "break",
                "case", "catch", "continue", "default", "do", "else", "for", "if",
                "return", "switch", "try", "while", "finally", "throw", "this",
                "super", "abstract", "final", "namtive", "private", "protected",
                "public", "static", "synchronized", "transient", "volatile",
                "class", "extends", "implements", "interface", "package", "import",
                "throws","java","util","List","entity"];
//运算符
var calculate = ['+','-','*','/','％','!','=','>','<','&','|','^','~','++','--','==','!=','<=','>=','<<','>>','&&','||','+=',
                 '-=','*=','/=','%=','&=','^=','!=','<<=','>>=','>>>'];
//界符
var delimiters = [';',',','(',')','.','{','}','[',']'];

//存放构成单词符号的字符串
var wordsList = "";
var tokenListDisplay = "";
var symbals = {};
var allList = {};
var allListArray = [];
var count = 1;
var countSymbal = 1;
var symbalDisplay = "";
var error = {};
//存放去掉注释后的字符串
var notAnnotationContent = [];
var notAnnotationCount = 0;
//记录注释
var annotation = "";
var closeAnnotation = "";
//记录汉字
var ChineseCharac = "";


//获取keyWords的长度
var keyWordsLength = keyWords.length;

//获取calculate的长度
var calculateLength = calculate.length;

//获取delimiters的长度
var delimitersLength = delimiters.length;
//标记多行注释开始和结束的位置
var startAnnotation = 0;
var endAnnotation = 0;
//存放标识符
var identifiers = {};
var fileName = null;

/**
 * 预处理  去掉空格
 */
function trimLeft(s){  
	if(s == null) {  
		return "";  
	}  
	var whitespace = new String(" \t\n\r");  
	var str = new String(s);  
	if (whitespace.indexOf(str.charAt(0)) != -1) {  
		var j=0, i = str.length;  
		while (j < i && whitespace.indexOf(str.charAt(j)) != -1){  
			j++;  
		}  
		str = str.substring(j, i);  
	}  
	return str.toString();  
}  

function readOneLine(){
//	var content = $("#myDiv").val().split("\n");
//	for(var i = 0;i < content.length;i++){
//		var contentNew = trimLeft(content[i]);
//		isAnnotationByLine();
//	}
	var contentNoAnnotation = isAnnotationByLine();
	for(var i = 0;i < contentNoAnnotation.length;i++){
		readWord(contentNoAnnotation[i]);
	}
}

function readWord(str){
	var tempStr = str;
	var tempNumber = "";
	if(str.length != 0){
		for(var i = 0;i < str.length;i++){
			var reg = new RegExp("[\\u4E00-\\u9FFF]+$","g");
			if(true == judgeIsChar(str.charAt(i))){
				concat(str.charAt(i));
			}else if(true == judgeIsSymbal(str.charAt(i))){
				concat(str.charAt(i));
			}else if(str.charAt(i) == '.' || str.charAt(i) == ';' || str.charAt(i) == ',' || str.charAt(i) == '(' || str.charAt(i) == '!'){
				if(wordsList != "" && true == judgeIsKeyWord()){
					i--;
					wordsList = "";
					$("#token").append(tokenListDisplay);
					$("#symbals").append(symbalDisplay);
					tokenListDisplay = "";
					symbalDisplay = "";
				}else if(wordsList != "" && false == judgeIsKeyWord()){
					i--;
					$("#symbals").append(symbalDisplay);
					wordsList = "";
					tokenListDisplay = "";
					symbalDisplay = "";
				}else if(wordsList == ""){
					if(str.charAt(i) == "."){
						if(true == judgeIsDelimiters(".")){
							$("#token").append(tokenListDisplay);
							$("#symbals").append(symbalDisplay);
						}
					}else if(str.charAt(i) == ";"){
						if(true == judgeIsDelimiters(";")){
							$("#token").append(tokenListDisplay);
							$("#symbals").append(symbalDisplay);
						}

					}else if(str.charAt(i) == ","){
						if(true == judgeIsDelimiters(",")){
							$("#token").append(tokenListDisplay);
							$("#symbals").append(symbalDisplay);
						}
					}else if(str.charAt(i) == "("){
						if(true == judgeIsDelimiters("(")){
							$("#token").append(tokenListDisplay);
							$("#symbals").append(symbalDisplay);
						}
					}
					tokenListDisplay = "";
					symbalDisplay = "";
				}
			}else if(str.charAt(i) == "/"){
				concat(str.charAt(i));
				if(str.charAt(i - 1) == "/"){
					wordsList = "";
					break;
				}
			}else if(reg.test(str.charAt(i))){
				concat(str.charAt(i));
			}else if(wordsList != "" && true == judgeIsKeyWord()){
				wordsList = "";
				$("#token").append(tokenListDisplay);
				$("#symbals").append(symbalDisplay);
				tokenListDisplay = "";
				symbalDisplay = "";
			}else if(true == judgeIsCalcute(str.charAt(i))){
				wordsList = "";
				$("#token").append(tokenListDisplay);
				$("#symbals").append(symbalDisplay);
				tokenListDisplay = "";
				symbalDisplay = "";
			}else if(true == judgeIsDelimiters(str.charAt(i))){
				wordsList = "";
				$("#token").append(tokenListDisplay);
				$("#symbals").append(symbalDisplay);
				tokenListDisplay ="";
				symbalDisplay = "";
			}else if(true == judgeIsCalcute(str.charAt(i))){
				wordsList = "";
				$("#token").append(tokenListDisplay);
				$("#symbals").append(symbalDisplay);
				tokenListDisplay = "";
				symbalDisplay = "";
			}else if(true == judgeIsDelimiters(str.charAt(i))){
				wordsList = "";
				$("#token").append(tokenListDisplay);
				$("#symbals").append(symbalDisplay);
				tokenListDisplay = "";
				symbalDisplay = "";
			}else if(true == judgeIsDigit(str.charAt(i))){
				wordsList += str.charAt(i);
				for(var i = i + 1;i < str.length;i++){
					if(str.charAt(i) != " " && str.charAt(i) != ";"|| str.charAt(i) == "." || str.charAt(i) == "e" || str.charAt(i) == "E" || str.charAt(i) == "-" || str.charAt(i) == "+"){
						if(str.charAt(i) == "e" || str.charAt(i) == "E"){
							if(str.charAt(i + 1) == "-" || str.charAt(i + 1) == "+"){
								concat(str.charAt(i));
							}else if(true == judgeIsDigit(str.charAt(i + 1))){
								concat(str.charAt(i));
							}
						}else{
							concat(str.charAt(i));
						}
					}else if(str.charAt(i) == " " || str.charAt(i) == ';' || str.charAt(i) == ','){
						var boolDigst = isRealNum(wordsList);
						if(true == boolDigst){	
							allList["数字常量" + ++count] = wordsList;
							identifiers = {"数字常量":wordsList};
							tokenListDisplay = "<tr><td>100</td>" + "<td>" + wordsList + "</td><td>数字常量\n</td></tr>";
							symbalDisplay = "<tr><td>101</td>" + "<td>" + wordsList + "</td><td>数字常量\n</td></tr>";
							$("#token").append(tokenListDisplay);
							$("#symbals").append(symbalDisplay);
							break;
						}else if(false == boolDigst){
							error["标识符错误" + countSymbal++] = wordsList;
							$("#error").append("<tr><td>标识符错误 </td><td>" + wordsList + "</td></tr>");
							break;
						}
					}else{
						var isError = isErrorBySambal(wordsList);
						if(isError){
							error["标识符错误" + countSymbal++] = wordsList;
							$("#error").append("<tr><td>标识符错误 </td><td>" + wordsList + "</td></tr>");
						}
						wordsList = "";
						break;
					}
				}
				wordsList = "";
				tokenListDisplay ="";
				symbalDisplay = "";
			}else{
				wordsList = "";
				tokenListDisplay ="";
				symbalDisplay = "";
			}
		}
	}else{
		return ;
	}
}

//判断多行注释
function isAnnotationByLine(){
	var content = $("#myDiv").val().split("\n");
	for(var i = 0;i < content.length;i++){
		var contentNew = trimLeft(content[i]);
		for(var j = 1;j < contentNew.length;j++){
			if(contentNew.charAt(j - 1) == "/" && contentNew.charAt(j) == "*"){
				annotation = "/*";
				startAnnotation = i;
			}else if(contentNew.charAt(j - 1) == "*" && contentNew.charAt(j) == "/"){
				closeAnnotation = "*/";
				endAnnotation = i;
			}
		}
	}
	for(var i = 0;i < content.length;i++){
		if(i >= startAnnotation && i <= endAnnotation){
			
		}else{
			notAnnotationContent[notAnnotationCount++] = content[i];
		}
	}
	return notAnnotationContent;
}

//判断是否标识符错误
function isErrorBySambal(tempStr){
	for(var i = 1;i < tempStr.length;i++){
		if(true != judgeIsDigit(tempStr.charAt(i))){
			return true;
		}
	}
	return false;
}

//判断是否为数字
function isRealNum(val){
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
	if(val === "" || val ==null){
		return false;
	}
	if(!isNaN(val)){
	//	var tempVal = val + "";
		if(val.charAt(0) == 0){
			var isError = isErrorBySambal(val);
			if(isError){
				error["标识符错误" + countSymbal++] = val;
				$("#error").append("<tr><td>非正确数字</td><td>" + val + "</td></tr>");
			}
			return error;
		}
		return true;
	}else{
		return false;
	}
}
//判断0-9
function judgeIsDigit(ch){
	if(ch >= '0' && ch <= '9'){
		return true;
	}
	return false;
}

//判断是否是字符
function judgeIsChar(ch){
	if(ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z'){
		return true;
	}else{
		return false;
	}
}

//判断该字符是否为空格
function judgeIsSpace(ch){
	if(ch == 32){
		return true;
	}else{
		return false;
	}
}

//判断该字符是否是美元或者下划线
function judgeIsSymbal(ch){
	if(ch == "$" || ch == "_"){
		return true;
	}else{
//		wordsList += ch;
//		error["标识符错误" + countSymbal++] = wordsList;
//		$("#error").append("<tr><td>非正确数字</td><td>" + wordsList + "</td></tr>");
//		wordsList = "";
		return false;
	}
}

//将字符连接成字符串
function concat(ch){
	wordsList += ch;
}

//判断是否是界符
var judgeIsDelimiters = function(ch){
	for(var i = 0;i < delimiters.length;i++){
		if(ch == delimiters[i]){
			var judgeState = judgeIsRepeatWords(ch);
			if(judgeState){
				allList["界符" + ++count] = ch;
				tokenListDisplay = "<tr><td>" + (i + keyWordsLength + calculateLength + 2) + "</td><td>" + ch + "</td><td>界符\n</td></tr>";
				return true;
			}
		}
	}
	return false;
}

//判断是否是运算符
var judgeIsCalcute = function(ch){
	for(var i = 0;i < calculate.length;i++){
		if(ch == calculate[i]){
			var judgeState = judgeIsRepeatWords(ch);
			if(judgeState){
				allList["运算符" + ++count] = ch;
				//	allListArray.push(allList);
				tokenListDisplay = "<tr><td>" + (i + keyWordsLength + 2) + "</td><td>" + ch + "</td><td>运算符\n</td></tr>";
				return true;
			}
		}
	}
	return false;
}

//判断是否是保留字符
var judgeIsKeyWord = function(){
	var words = wordsList;
	var tempBool = judgeIsRepeatWords(words);
	var isKey = false;
	for(var i = 0;i < keyWords.length;i++){
		if(wordsList == keyWords[i]){
			isKey = true;
			if(tempBool == true){
				allList["关键字" + ++count] = wordsList;
				//	allListArray.push(allList);
				tokenListDisplay = "<tr><td>" + i + "<td>" + wordsList + "</td><td>关键字 \n</td></tr>";
			}
			return true;
		}
	}
	if(isKey == false){
		if(tempBool == true){
			var reg = new RegExp("[\\u4E00-\\u9FFF]+$","g");
			if(isRealNum(wordsList)){
				allList["数字常量" + ++count] = wordsList;
				identifiers = {"数字常量":wordsList};
				tokenListDisplay = "<tr><td>100</td>" + "<td>" + wordsList + "</td><td>数字常量\n</td></tr>";
				symbalDisplay = "<tr><td>101</td>" + "<td>" + wordsList + "</td><td>字符常量\n</td></tr>";
				return true;
			}else if(reg.test(wordsList)){
				allList["字符常量" + ++count] = wordsList;
				tokenListDisplay = "<tr><td>101</td>" + "<td>" + wordsList + "</td><td>字符常量\n</td></tr>";
				symbalDisplay = "<tr><td>101</td>" + "<td>" + wordsList + "</td><td>字符常量\n</td></tr>";
				return true;
			}else{
				allList["标识符" + ++count] = wordsList;
				//	symbals["标识符" + countSymbal++] = wordsList;
				//	allListArray.push(allList);
				identifiers = {"标识符":wordsList}
				tokenListDisplay = "<tr><td>53</td>" + "<td>" + wordsList + "</td><td>标识符\n</td></tr>";
				symbalDisplay = "<tr><td>53</td>" + "<td>" + wordsList + "</td><td>标识符\n</td></tr>";
				return true;
			}

		}
	}
	return false;
}

//判断是否有重复
var judgeIsRepeatWords = function(ch){
	for(var word in allList.valueOf()){
		if(ch == allList[word]){
			return false;
		}
	}
	return true;
}


/**
 * 对文件的操作
 * @param files
 */

//读取文件
function handleFiles(files)
{
	fileName = files[0].name;
	if(files.length)
	{
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function()
		{
			myDiv.innerHTML = this.result;
		};
		reader.readAsText(file);
	}
}
//后台读文件
function openFile(){
	$.ajax({
		type: "post",
		url: "/compling/servlet/ComplingServlet",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		data: {"bool":"bool"},
		success: function (data)
		{
			if("未选择文件" == data){
				alert(data);
			}else if("请填写正确的文件打开路径" == data){
				alert(data);
			}else{
				//var ddd = eval(data);
				$("#myDiv").val(data);
			}
		},
		error:function (error) {      
			alert("请求失败！");
		}
	});
}
//保存文件
function saveFile(){
	var fileContent = $("#myDiv").val();
	if(fileContent != null && fileContent != ""){
		$.ajax({
			type: "post",
			url: "/compling/servlet/ComplingServlet",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			data: {"fileContent":fileContent,"fileName":"saveFile"},
//			cache: false,
//			async : false,
//			dataType: "json",
			success: function (data)
			{
				$("#myDiv").val("");
				alert(data);
			},
			error:function (error) {      
				alert("请求失败！");
			}
		});
	}else{
		alert("内容为空")
	}
}

//文件另存为
function saveOtherFile(){
	var fileContent = $("#myDiv").val();
	if(fileContent != null && fileContent != ""){
		$.ajax({
			type: "post",
			url: "/compling/servlet/ComplingServlet",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			data: {"fileContent":fileContent,"fileName":fileName},
//			cache: false,
//			async : false,
//			dataType: "json",
			success: function (data)
			{
				if("请填写正确的保存路径" == data){
					alert(data);
				}else{
					$("#myDiv").val("");
				}
			},
			error:function (error) {      
				alert("请求失败！");
			}
		});
	}else{
		alert("内容为空");
	}
}




