package servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.filechooser.FileSystemView;

import org.json.JSONObject;

import com.alibaba.fastjson.JSONArray;

/**
 * Servlet implementation class ComplingServlet
 */
@WebServlet("/ComplingServlet")
public class ComplingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ComplingServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("text/html");
		this.doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings({ "resource", "unused" })
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		response.setContentType("UTF-8");
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html");
		response.setContentType("text/html");
		OutputStream out = response.getOutputStream();
		HttpSession session = request.getSession();
		String fileContent = request.getParameter("fileContent");
		String fileName = request.getParameter("fileName");
		String bool = request.getParameter("bool");
		String filePathNew = "";
		if("saveFile".equals(fileName)){
//			Object object = session.getAttribute("filePath");
//			File fileObject = (File)object;
//			filePathNew = fileObject.getPath();
			filePathNew = "D:/angular/workdpace2/compilingspace/" + fileName;
			File file = new File(filePathNew);
			writeFile(judeFileExists(file),fileContent);
			request.getSession().removeAttribute("filePath");
		}else if("bool".equals(bool)){
			String fileStr = openFile(session);
			out.write(fileStr.getBytes("UTF-8"));
//			File file = getFile();
//			JSONArray ja1 = new JSONArray();
//			ja1.add(file);
//			out.write(ja1.toString().getBytes("UTF-8"));
			//			openFile(session);
			//			JSONObject jsonObject = new JSONObject();  
			//	        jsonObject.put("categorys", getFile());
			//	        out.write(jsonObject.toString().getBytes("UTF-8"));  
			out.flush();
			out.close();
		}else{
			String tip = writeFile(getFile(),fileContent);
			request.getSession().removeAttribute("filePath");
			out.write(tip.getBytes("UTF-8"));
			out.flush();
			out.close();
		}
		out.flush();
		out.close();
	}

	public static String writeFile(File file,String content) throws IOException{
		try{
			FileOutputStream fop = null;
			fop = new FileOutputStream(file);
			byte[] contentInBytes = content.getBytes();
			fop.write(contentInBytes);
			fop.flush();
			fop.close();
			return "保存成功";
		}catch(Exception e){
			e.printStackTrace();;
			return "请填写正确的保存路径";
		}
	}
	public static File judeFileExists(File file) throws IOException {
		if(file.exists())  
		{  
			file.delete();  
			file.createNewFile();  
			return file;
		}  
		else{
			file.createNewFile();  
			return file;
		}
	}

	public static File getFile(){
		JFileChooser jfc=new JFileChooser();  
		//设置当前路径为桌面路径,否则将我的文档作为默认路径
		FileSystemView fsv = FileSystemView .getFileSystemView();
		jfc.setCurrentDirectory(fsv.getHomeDirectory());
		//JFileChooser.FILES_AND_DIRECTORIES 选择路径和文件
		jfc.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES );  
		//弹出的提示框的标题
		jfc.showDialog(new JLabel(), "确定");  
		//用户选择的路径或文件
		File file=jfc.getSelectedFile();  
		return file;
	}

	public static String openFile(HttpSession session){
		String fileStr = "";
		try{
			File file = getFile();
			if(file != null){
				session.setAttribute("filePath", file);			
				BufferedReader reader = null;
				try {
					System.out.println("以行为单位读取文件内容，一次读一整行：");
					reader = new BufferedReader(new FileReader(file));
					String tempString = null;
					int line = 1;
					// 一次读入一行，直到读入null为文件结束
					while ((tempString = reader.readLine()) != null) {
						// 显示行号
						System.out.println("line " + line + ": " + tempString);
						fileStr += tempString;
						line++;
					}
					reader.close();

				} catch (IOException e) {
					fileStr = "请填写正确的文件打开路径";
					e.printStackTrace();
					return fileStr;
				}
				return fileStr;
			}else{
				fileStr = "未选择文件";
			}
		}catch(Exception e){
			fileStr = "请填写正确的文件打开路径";
			e.printStackTrace();
			return fileStr;
		}
		return fileStr;
	}
}
