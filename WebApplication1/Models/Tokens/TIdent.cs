using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TIdent : Token
    {
        public TIdent(string value) : base(value)
        {

        }

        public override string getName()
        {
            return "TIdent_";
        }
    }
}