using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace WebApplication1.Models
{
    public class TestClass
    {
        public void TestMethod(Page page)
        {
            int x = 100;
            int y = 100;
            for(int i = 0; i < 10; i++)
            {
                string order = "drawCircle(" + x + "," + y + ",10);";
                ScriptManager.RegisterStartupScript(page, GetType(), "myKey", order, true);
                y += 50;
            }
            
        }
    }
}