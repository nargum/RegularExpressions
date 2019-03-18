using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TDot : Token
    {
        public TDot() : base(".")
        {

        }

        public override string getName()
        {
            return "TDot_";
        }
    }
}