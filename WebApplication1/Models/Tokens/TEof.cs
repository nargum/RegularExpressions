using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TEof : Token
    {
        public TEof() : base("__")
        {

        }

        public override string getName()
        {
            return "TEof_";
        }
    }
}