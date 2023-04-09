using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI;
using System.Text;

namespace EcoLifeStyleAPI.Controllers;

public class AdvisorController : Controller
{
	private static readonly OpenAIClient openAiClient = new(new OpenAIAuthentication("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"));
	private static readonly List<GetDataRequestModel> chatHistory = new();



	[AllowAnonymous]
	[HttpPost("GetData")]
	public async Task<IActionResult> GetData([FromBody] GetDataRequestModel request)
	{
		if (request is null || string.IsNullOrEmpty(request.Text) || request.UserId == Guid.Empty)
		{
			return BadRequest();
		}
		string FinishText = request.Text + "Дай ссылки на магазины в Казахстане где продаются эти товары";
		chatHistory.Add(new GetDataRequestModel { UserId = request.UserId, Text = FinishText });
		return Ok(await GetOpenAIResult(request.UserId));
	}


	#region Helper

	public class GetDataRequestModel
	{
		public Guid UserId { get; set; }
		public string Text { get; set; }
	}
	private static async Task<string> GetOpenAIResult(Guid userID)
	{
		StringBuilder sb = new();
		foreach (var entry in chatHistory.Where(x => x.UserId == userID))
		{
			sb.AppendLine(entry.Text);
		}

		var result = (await openAiClient.CompletionsEndpoint.CreateCompletionAsync(sb.ToString(), temperature: 0.5, maxTokens: 1000)).Completions.OrderByDescending(c => c.Text.Length).First().Text; ;
		chatHistory.Add(new GetDataRequestModel { UserId = userID, Text = result });
		return result;
	}

	#endregion Helper
}