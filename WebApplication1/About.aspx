<%@ Page Title="About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="WebApplication1.About" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    
    <h1 id="title">Hello world</h1>
    <canvas id ="canvas"></canvas>
    <script src="Scripts/canvas.js"></script>
    <script src="Scripts/TreeNode.js"></script>
    <script src="Scripts/Token.js"></script>
    <script src="Scripts/Expression.js"></script>
    <script src="Scripts/Graphs.js"></script>
    <button type="button" runat="server" onclick="clearCanvas()">Clear canvas</button>
    <button type="button" runat="server" onclick="addNewState()">Add new states</button>
    <button type="button" runat="server" onclick="move()">Move</button>
    <button type="button" runat="server" onclick="arrow()">draw arrow</button>
    <button type="button" runat="server" onclick="test()">draw arc</button>
    <asp:Button ID="Test" runat="server" Text="Button" OnClick="btn_onclick" />
    <button type="button" runat="server" onclick="drawPart()">draw part</button>
    <button type="button" runat="server" onclick="getFirst()">getFirst</button>
</asp:Content>
