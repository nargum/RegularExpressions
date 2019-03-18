using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebApplication1.Models;

namespace WebApplication1
{
    public partial class About : Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        protected void btn_onclick(object sender, EventArgs e)
        {

            ExpressionValidator v = new ExpressionValidator("a");
            TreeNode<string> root = v.parse();
            root.drawExpression(this);

            /*try
            {
                Console.WriteLine("Entered expression: " + v.getExpression());
                Console.WriteLine("Short expression: " + root.BuildShortExpression());
                Console.WriteLine("Long expression: " + root.BuildFullExpression());
            }
            catch (NullReferenceException)
            {

            }*/
        }
    }
}