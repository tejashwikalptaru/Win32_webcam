#pragma comment(linker,"\"/manifestdependency:type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'\"")
#include <windows.h>
#include "resource.h"
#include "functions.h"  // All major functions.
#include <vfw.h>
#include <time.h>
#include <commctrl.h>

#pragma comment(lib,"Vfw32.lib")
#pragma comment(lib,"gdi32.lib")
#pragma comment(lib,"comctl32.lib")

HINSTANCE hInst;
HWND camhwnd;
HDC hdc ;
HDC hdcMem;
PAINTSTRUCT ps;
HBITMAP hbm;
RECT rc;
char ImageName[14];
TCHAR folder[MAX_PATH],folder_cache[MAX_PATH];
int CheckBoxValue=0,CheckKey=0;
char infos[]="TejashCAM v2.0\nThis is a small under developement\nutility for taking still photos from Webcam\nProduct of: TechTejash Developers\nhttp://www.techtejash.com\n\nHelp:\n1.Run the application,and click on Save folder.Now select your desired folder, where picture will be saved.\n\n2.There is also an option of Image preview.If this option is enabled, you will be asked, if you want to view the taken images or not. You can disable this option if you don't want instant preview.\n\n3.There is also an option of open.This will open your folder where images are saved.\n\n4.Click on Start Camera, this will start your webcam, and you can see images.\n\n5.Click on setting, for webcam settings like camera selection,brightness, contrast and others.\n\n6.Click on Capture to grab and save your images.\n\nContact: www.techtejash.com";
char localdir[256];

BOOL CALLBACK DlgProc(HWND hWnd,UINT message,WPARAM wParam,LPARAM lParam);
void Dispatcher(HWND hWnd,WPARAM wParam);
void TakeImage(HWND hWnd,HWND camhwnd);

int WINAPI WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance,LPSTR lpCmdLine,int nShowCmd)
{
	hInst=hInstance;
	InitCommonControls();
	DialogBoxParam(hInstance,MAKEINTRESOURCE(IDD_DIALOG1),HWND_DESKTOP,DLGPROC(&DlgProc),NULL);
}

BOOL CALLBACK DlgProc(HWND hWnd,UINT message,WPARAM wParam,LPARAM lParam)
{
	switch(message)
	{
	case WM_INITDIALOG:
		ZeroMemory(localdir,sizeof(localdir));
		CheckBoxValue=InitConfig(folder_cache,localdir,hWnd);
		if(CheckBoxValue==1)
		{
			CheckKey=1;
			CheckDlgButton(hWnd,IDC_CHECK1,true);
		}
		SetDlgItemText(hWnd,IDC_EDIT1,folder_cache);
		SendMessage(hWnd, WM_SETICON, 1,LPARAM(LoadIcon(hInst,(LPCSTR)IDI_ICON1)));
		camhwnd = capCreateCaptureWindow ("camera window", WS_CHILD , 0, 0, 474, 360, hWnd, 0);
		EnableWindow(GetDlgItem(hWnd,IDC_BUTTON3),false);
		EnableWindow(GetDlgItem(hWnd,IDC_BUTTON2),false);
		return true;
	case WM_COMMAND:
		Dispatcher(hWnd,wParam);
		return true;
	case WM_CLOSE:
		SendMessage(camhwnd, WM_CAP_DRIVER_DISCONNECT, 0, 0);
		EndDialog(hWnd,0);
		return true;
	}
	return false;
}

void Dispatcher(HWND hWnd,WPARAM wParam)
{
	switch(LOWORD(wParam))
	{
	case IDC_BUTTON1:
		ShowWindow(camhwnd,SW_SHOW);
		if(SendMessage(camhwnd,WM_CAP_DRIVER_CONNECT,0,0))
		{
			SendMessage(camhwnd, WM_CAP_SET_SCALE, true , 0);
			SendMessage(camhwnd, WM_CAP_SET_PREVIEWRATE,66, 0);
			SendMessage(camhwnd, WM_CAP_SET_PREVIEW, true , 0);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON3),true);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON2),true);
		}
		else
		{
			MessageBox(hWnd,"Unable to Connect to Camera !\nCheck if Camera is connected or not","Camera not found",MB_ICONERROR);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON1),false);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON2),false);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON3),false);
			EnableWindow(GetDlgItem(hWnd,IDC_BUTTON5),false);
			SendMessage(hWnd,WM_COMMAND,IDC_BUTTON2,0);
		}
		break;
	case IDC_BUTTON2:
		ShowWindow(camhwnd,SW_HIDE);
		SendMessage(camhwnd, WM_CAP_DRIVER_DISCONNECT, 0, 0);
		EnableWindow(GetDlgItem(hWnd,IDC_BUTTON3),false);
		EnableWindow(GetDlgItem(hWnd,IDC_BUTTON2),false);
		break;
	case IDC_BUTTON3:
		TakeImage(hWnd,camhwnd);
		break;
	case IDC_BUTTON4:
		MessageBox(hWnd,infos,"Help and Informations",MB_ICONINFORMATION);
		break;
	case IDC_BUTTON5:
		SendMessage(hWnd,WM_COMMAND,IDC_BUTTON1,0); // Sends message to active camera
		SendMessage(camhwnd,WM_CAP_DRIVER_CONNECT,0,0);
		SendMessage(camhwnd,WM_CAP_DLG_VIDEOSOURCE,0,0);
		break;
	case IDC_CHECK1:
		if(CheckKey==0)
		{
			WritePrivateProfileString("preview","enabled","e",localdir);
			CheckKey=1;
		}
		else
		{
			WritePrivateProfileString("preview","enabled","d",localdir);
			CheckKey=0;
		}
		break;
	case IDC_BUTTON6:
		GetFolderSelection(hWnd,folder_cache,"Select a folder where images will be saved");
		SetDlgItemText(hWnd,IDC_EDIT1,folder_cache);
		WritePrivateProfileString("folder","path",folder_cache,localdir); //When folder location changed, saves it to config file
		break;
	case IDC_BUTTON7:
		ShellExecute(hWnd,"OPEN",folder_cache,0,0,SW_MAXIMIZE);
		break;
	}
}

void TakeImage(HWND hWnd,HWND camhwnd)
{
	//Grab a Frame, pauses the image and grabs it
	SendMessage(camhwnd, WM_CAP_GRAB_FRAME, 0, 0);
	//Copy the frame we have just grabbed to the clipboard
	SendMessage(camhwnd, WM_CAP_EDIT_COPY,0,0);

	//Copy the clipboard image data to a HBITMAP object called hbm
	hdc = BeginPaint(camhwnd, &ps);
	hdcMem = CreateCompatibleDC(hdc);
	if (hdcMem != NULL)
	{
		if (OpenClipboard(camhwnd))
		{
			hbm = (HBITMAP) GetClipboardData(CF_BITMAP);
			SelectObject(hdcMem, hbm);
			GetClientRect(camhwnd, &rc);
			CloseClipboard();
		}
	}
	//Save hbm to a .bmp file called Frame.bmp
	PBITMAPINFO pbi = CreateBitmapInfoStruct(hWnd, hbm);

	//Re-getting new image name
	ZeroMemory(ImageName,sizeof ImageName);
	GetName(ImageName);

	//Refreshing folder name
	ZeroMemory(folder,sizeof folder);
	lstrcpy(folder,folder_cache);//Restoring folder address
	lstrcat(folder,ImageName); //Adding image name on location of folder

	CreateBMPFile(hWnd,folder, pbi, hbm, hdcMem,CheckKey);

	SendMessage(hWnd,WM_COMMAND,IDC_BUTTON1,0); //Sending message to start again
}