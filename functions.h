#include <windows.h>
#include <time.h>
#include <shlobj.h> // For folder browsing

PBITMAPINFO CreateBitmapInfoStruct(HWND hwnd, HBITMAP hBmp)
{
	BITMAP bmp;
	PBITMAPINFO pbmi;
	WORD cClrBits;
	// Retrieve the bitmap color format, width, and height.
	if (!GetObject(hBmp, sizeof(BITMAP), (LPSTR)&bmp))
	{
	MessageBox(hwnd,"GetObject","Error",MB_OK );
	}
	// Convert the color format to a count of bits.
	cClrBits = (WORD)(bmp.bmPlanes * bmp.bmBitsPixel);
	if (cClrBits == 1)
	 cClrBits = 1;
	else if (cClrBits <= 4)
	 cClrBits = 4;
	else if (cClrBits <= 8)
	 cClrBits = 8;
	else if (cClrBits <= 16)
	 cClrBits = 16;
	else if (cClrBits <= 24)
	 cClrBits = 24;
	else cClrBits = 32;

	// Allocate memory for the BITMAPINFO structure. (This structure
	// contains a BITMAPINFOHEADER structure and an array of RGBQUAD
	// data structures.)

	if (cClrBits != 24)
	{
	 pbmi = (PBITMAPINFO) LocalAlloc(LPTR,sizeof(BITMAPINFOHEADER) + sizeof(RGBQUAD) * (1<< cClrBits));
	}
	// There is no RGBQUAD array for the 24-bit-per-pixel format.
	else
	 pbmi = (PBITMAPINFO) LocalAlloc(LPTR, sizeof(BITMAPINFOHEADER));

	// Initialize the fields in the BITMAPINFO structure.
	pbmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	pbmi->bmiHeader.biWidth = bmp.bmWidth;
	pbmi->bmiHeader.biHeight = bmp.bmHeight;
	pbmi->bmiHeader.biPlanes = bmp.bmPlanes;
	pbmi->bmiHeader.biBitCount = bmp.bmBitsPixel;
	if (cClrBits < 24)
	{
	 pbmi->bmiHeader.biClrUsed = (1<<cClrBits);
	}
	// If the bitmap is not compressed, set the BI_RGB flag.
	pbmi->bmiHeader.biCompression = BI_RGB;

	// Compute the number of bytes in the array of color
	// indices and store the result in biSizeImage.
	// For Windows NT, the width must be DWORD aligned unless
	// the bitmap is RLE compressed. This example shows this.
	// For Windows 95/98/Me, the width must be WORD aligned unless the
	// bitmap is RLE compressed.
	pbmi->bmiHeader.biSizeImage = ((pbmi->bmiHeader.biWidth * cClrBits +31) & ~31) /8 * pbmi->bmiHeader.biHeight;
	// Set biClrImportant to 0, indicating that all of the
	// device colors are important.
	pbmi->bmiHeader.biClrImportant = 0;

	return pbmi; //return BITMAPINFO
}

void SucessInfo(HWND hWnd,LPCSTR name,int CheckVal)
{
	if(CheckVal==1)
	{
		if(MessageBox(hWnd,"Image saved !\nShow the captured Image ?","Preview Image ?",MB_YESNO|MB_ICONQUESTION)==IDYES)
		{
			ShellExecute(hWnd,"OPEN",name,0,0,SW_SHOW);
		}
	}
	else
		MessageBeep(MB_ICONINFORMATION);
}

void CreateBMPFile(HWND hwnd, LPTSTR pszFile, PBITMAPINFO pbi, HBITMAP hBMP, HDC hDC,int CheckVal)
{
HANDLE hf;                  // file handle
BITMAPFILEHEADER hdr;       // bitmap file-header
PBITMAPINFOHEADER pbih;     // bitmap info-header
LPBYTE lpBits;              // memory pointer
DWORD dwTotal;              // total count of bytes
DWORD cb;                   // incremental count of bytes
BYTE *hp;                   // byte pointer
DWORD dwTmp;

	pbih = (PBITMAPINFOHEADER) pbi;
	lpBits = (LPBYTE) GlobalAlloc(GMEM_FIXED, pbih->biSizeImage);

	if (!lpBits)
	{
		MessageBox(hwnd,"GlobalAlloc","Error", MB_OK );
	}
	// Retrieve the color table (RGBQUAD array) and the bits
	// (array of palette indices) from the DIB.
	if (!GetDIBits(hDC, hBMP, 0, (WORD) pbih->biHeight, lpBits, pbi,DIB_RGB_COLORS))
	{
	MessageBox(hwnd,"GetDIBits","Error",MB_OK );
	}
	// Create the .BMP file.
	hf = CreateFile(pszFile,GENERIC_READ | GENERIC_WRITE,(DWORD) 0,NULL,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,(HANDLE) NULL);
	if (hf == INVALID_HANDLE_VALUE)
	{
	MessageBox( hwnd,"CreateFile","Error", MB_OK);
	}

	hdr.bfType = 0x4d42;  // File type designator "BM" 0x42 = "B" 0x4d = "M"
	// Compute the size of the entire file.
	hdr.bfSize = (DWORD) (sizeof(BITMAPFILEHEADER) + pbih->biSize + pbih->biClrUsed * sizeof(RGBQUAD) + pbih->biSizeImage);
	hdr.bfReserved1 = 0;
	hdr.bfReserved2 = 0;
	// Compute the offset to the array of color indices.
	hdr.bfOffBits = (DWORD) sizeof(BITMAPFILEHEADER) + pbih->biSize + pbih->biClrUsed * sizeof (RGBQUAD);
	// Copy the BITMAPFILEHEADER into the .BMP file.
	if (!WriteFile(hf, (LPVOID) &hdr, sizeof(BITMAPFILEHEADER), (LPDWORD) &dwTmp,  NULL) )
	{
	 MessageBox(hwnd,"WriteFileHeader","Error",MB_OK );
	}
	// Copy the BITMAPINFOHEADER and RGBQUAD array into the file.
	if (!WriteFile(hf, (LPVOID) pbih, sizeof(BITMAPINFOHEADER) + pbih->biClrUsed * sizeof (RGBQUAD), (LPDWORD) &dwTmp, NULL))
	{
	MessageBox(hwnd,"WriteInfoHeader","Error",MB_OK );
	}
	// Copy the array of color indices into the .BMP file.
	dwTotal = cb = pbih->biSizeImage;
	hp = lpBits;
	if (!WriteFile(hf, (LPSTR) hp, (int) cb, (LPDWORD) &dwTmp,NULL))
	{
	MessageBox(hwnd,"WriteFile","Error",MB_OK );
	}
	// Close the .BMP file.
	if (CloseHandle(hf))
	{	
	SucessInfo(hwnd,pszFile,CheckVal);
	}
	else
	{
	MessageBox(hwnd,"CloseHandle","Error",MB_OK );
	}

	// Free memory.
	GlobalFree((HGLOBAL)lpBits);
}

void GetName(char ImageName[])
{
	int n=0;
	time_t t;
    srand((unsigned) time(&t));
	char TABLE[]={'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'};
	for(int i=0;i<10;i++)
	{
		n=rand()%26;
		ImageName[i]=TABLE[n];
	}
	lstrcat(ImageName,".bmp");
}

BOOL GetFolderSelection(HWND hWnd, LPTSTR szBuf, LPCTSTR szTitle)
{
	LPITEMIDLIST pidl     = NULL;
	BROWSEINFO   bi       = { 0 };
	BOOL         bResult  = FALSE;

	bi.hwndOwner      = hWnd;
	bi.pszDisplayName = szBuf;
	bi.pidlRoot       = NULL;
	bi.lpszTitle      = szTitle;
	bi.ulFlags        = BIF_RETURNONLYFSDIRS | BIF_USENEWUI;

	if ((pidl = SHBrowseForFolder(&bi)) != NULL)
	{   
		bResult = SHGetPathFromIDList(pidl, szBuf); 
		lstrcat(szBuf,"\\");
		CoTaskMemFree(pidl);
	}

	return bResult;
}

int InitConfig(char folder[],char settings_loc[],HWND hWnd)
{
	char data[256];
	char CheckVal[2];
	OFSTRUCT info;
	char location[256];
	char localdir[256];
	ZeroMemory(localdir,sizeof(localdir));
	ZeroMemory(location,sizeof(location));

	SHGetSpecialFolderPath(hWnd,localdir,CSIDL_LOCAL_APPDATA,false);
	lstrcat(localdir,"\\tconfig.ini");
	lstrcpy(settings_loc,localdir);
	if(OpenFile(localdir,&info,OF_EXIST)==HFILE_ERROR)
	{
		if((MessageBox(hWnd,"Welcome to TejasCAM\nYou are probably running this software first time.\nTake a look on 'help.txt' file for more informations\n\nAll photos taken by default will be saved on Desktop\nSet your desired folder, if you want to save photos on different locations.\n\nWould you like to see help ?","Welcome", MB_YESNO | MB_ICONINFORMATION))==IDYES)
		{
			SendMessage(hWnd,WM_COMMAND,IDC_BUTTON4,0);
		}
		SHGetSpecialFolderPath(hWnd,location,CSIDL_DESKTOP,0);
		lstrcat(location,"\\");
		WritePrivateProfileString("folder","path",location,localdir);
		WritePrivateProfileString("preview","enabled","d",localdir);
	}
	GetPrivateProfileString("folder","path",NULL,data,sizeof data,localdir);
	lstrcat(folder,data);
	GetPrivateProfileString("preview","enabled",NULL,CheckVal,sizeof CheckVal,localdir);
	int a=lstrcmp("d",CheckVal);
	if(a==0)
		return 0;
	else
		return 1;
}