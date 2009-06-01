package org.milfont;

import java.util.List;

public final class DataTransferObject {

	private int total;
	private List<? extends Object> results;
	
	public List<? extends Object> getResults() {
		return results;
	}
	public void setResults(List<? extends Object> results) {
		this.results = results;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	
}
