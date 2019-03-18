using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TEps : Token
    {
        public TEps() : base("ε")
        {

        }

        public override string getName()
        {
            return "TEps_";
        }
    }
}