
Func SwitchWindow($selector, $selectorText)
   Local $windowHandle = WinActivate($selector, $selectorText)
   Local $mousePos = MouseGetPos()
   WinSetState($windowHandle, $selectorText, @SW_RESTORE)
   WinMove($windowHandle, $selectorText, $mousePos[0], $mousePos[1], 1, 1)
   WinSetState($windowHandle, $selectorText, @SW_MAXIMIZE)
EndFunc

Func HotKeyProxy1()
   SwitchWindow("[CLASS:Notepad]", "")
EndFunc

Func HotKeyInit()
   HotKeySet("^+!#1", HotKeyProxy1)
EndFunc


HotKeyInit()
While True
   Sleep(200)
WEnd

